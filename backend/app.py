from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
import json
import os
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.auth.oauthlib.flow import Flow
from googleapiclient.discovery import build
import io
from docx import Document
import PyPDF2
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

# API 클라이언트 초기화
client = Anthropic()

# Google OAuth 설정
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/forms']

# 세션 저장소 (프로덕션에서는 Redis 등 사용)
sessions = {}

def extract_text_from_docx(file_content):
    """워드 파일에서 텍스트 추출"""
    doc = Document(io.BytesIO(file_content))
    return '\n'.join([para.text for para in doc.paragraphs])

def extract_text_from_pdf(file_content):
    """PDF 파일에서 텍스트 추출"""
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
    text = ''
    for page in pdf_reader.pages:
        text += page.extract_text() + '\n'
    return text

def analyze_survey_with_claude(file_text):
    """Claude를 사용해 설문 내용 분석"""
    prompt = f"""
다음 설문지를 분석하여 JSON 형식으로 구조화해주세요.

설문 내용:
{file_text}

다음 JSON 형식으로 반환해주세요:
{{
    "title": "설문 제목",
    "description": "설문 설명",
    "sections": [
        {{
            "name": "섹션 이름",
            "description": "섹션 설명 (있으면)",
            "questions": [
                {{
                    "id": 1,
                    "text": "문항 텍스트",
                    "type": "multiple_choice|short_answer|paragraph|scale|checkbox",
                    "required": true/false,
                    "options": ["선택지1", "선택지2"] (해당하는 경우만),
                    "scale_start": 1, (척도형인 경우)
                    "scale_end": 5,
                    "scale_labels": ["레이블1", "레이블5"]
                }}
            ]
        }}
    ]
}}

주의사항:
- type을 정확히 분류해주세요
- multiple_choice: 단일 선택
- checkbox: 복수 선택
- scale: 리커트 척도 (숫자 척도)
- short_answer: 단답형
- paragraph: 서술형
- options는 배열 형식으로 정확히 추출해주세요
- 한국어는 유지해주세요

JSON만 반환해주세요 (마크다운 코드블록 없이).
"""
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    try:
        result = json.loads(response.content[0].text)
        return result
    except json.JSONDecodeError:
        raise ValueError("Claude 응답이 유효한 JSON이 아닙니다")

def create_google_form(survey_data, credentials):
    """Google Forms API를 사용해 설문지 생성"""
    forms_service = build('forms', 'v1', credentials=credentials)
    drive_service = build('drive', 'v3', credentials=credentials)
    
    # 폼 생성
    form_body = {
        'info': {
            'title': survey_data['title'],
            'description': survey_data['description'],
        }
    }
    
    form = forms_service.forms().create(body=form_body).execute()
    form_id = form['formId']
    
    # 항목 추가
    requests = []
    
    for section in survey_data['sections']:
        # 섹션 제목 추가
        requests.append({
            'updateSectionExtraProperties': {
                'index': 0,
                'sectionProperties': {
                    'sectionDescription': section.get('description', ''),
                    'sectionTitle': section['name']
                },
                'fields': 'sectionDescription,sectionTitle'
            }
        })
        
        # 문항 추가
        for question in section['questions']:
            item = create_question_item(question)
            requests.append({
                'createItem': {
                    'item': item,
                    'location': {
                        'index': 0
                    }
                }
            })
    
    # 배치 업데이트
    if requests:
        forms_service.forms().batchUpdate(
            formId=form_id,
            body={'requests': requests}
        ).execute()
    
    # 공개 설정
    drive_service.files().update(
        fileId=form_id,
        body={'shared': True}
    ).execute()
    
    # 폼 URL 생성
    form_url = f"https://docs.google.com/forms/d/{form_id}/edit"
    response_url = f"https://docs.google.com/forms/d/{form_id}/viewform"
    
    return {
        'form_id': form_id,
        'edit_url': form_url,
        'response_url': response_url
    }

def create_question_item(question):
    """설문 문항을 Google Forms 형식으로 변환"""
    base_item = {
        'title': question['text'],
        'questionItem': {
            'question': {
                'required': question.get('required', False)
            }
        }
    }
    
    question_config = base_item['questionItem']['question']
    
    if question['type'] == 'multiple_choice':
        question_config['choiceQuestion'] = {
            'type': 'RADIO',
            'options': [{'value': opt} for opt in question.get('options', [])]
        }
    elif question['type'] == 'checkbox':
        question_config['choiceQuestion'] = {
            'type': 'CHECKBOX',
            'options': [{'value': opt} for opt in question.get('options', [])]
        }
    elif question['type'] == 'scale':
        question_config['scaleQuestion'] = {
            'low': question.get('scale_start', 1),
            'high': question.get('scale_end', 5),
            'lowLabel': question.get('scale_labels', [''])[0],
            'highLabel': question.get('scale_labels', ['', ''])[-1]
        }
    elif question['type'] == 'short_answer':
        question_config['textQuestion'] = {}
    elif question['type'] == 'paragraph':
        question_config['paragraphQuestion'] = {}
    
    return base_item

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """파일 업로드 및 설문 분석"""
    try:
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': '파일이 선택되지 않음'}), 400
        
        # 파일 내용 읽기
        file_content = file.read()
        
        # 파일 형식에 따라 텍스트 추출
        if file.filename.endswith('.docx'):
            text = extract_text_from_docx(file_content)
        elif file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(file_content)
        else:
            return jsonify({'error': '지원하지 않는 파일 형식 (DOCX, PDF만 가능)'}), 400
        
        # Claude로 분석
        survey_data = analyze_survey_with_claude(text)
        
        # 세션에 임시 저장
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            'survey_data': survey_data,
            'original_text': text
        }
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'survey': survey_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """Google OAuth 인증 시작"""
    try:
        flow = Flow.from_client_secrets_file(
            'credentials.json',
            scopes=SCOPES,
            redirect_uri='http://localhost:5000/api/auth/callback'
        )
        
        auth_url, state = flow.authorization_url(prompt='consent')
        
        # 상태 저장
        sessions[state] = {'flow': flow}
        
        return jsonify({'auth_url': auth_url})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/callback', methods=['GET'])
def auth_callback():
    """Google OAuth 콜백"""
    try:
        state = request.args.get('state')
        code = request.args.get('code')
        
        if state not in sessions:
            return jsonify({'error': '유효하지 않은 상태'}), 400
        
        flow = sessions[state]['flow']
        flow.fetch_token(authorization_response=request.url)
        
        credentials = flow.credentials
        sessions[state]['credentials'] = credentials
        
        return jsonify({
            'success': True,
            'state': state
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/create-form', methods=['POST'])
def create_form():
    """설문지 생성"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        state = data.get('state')
        
        if session_id not in sessions:
            return jsonify({'error': '유효하지 않은 세션'}), 400
        
        if state not in sessions or 'credentials' not in sessions[state]:
            return jsonify({'error': '인증이 필요합니다'}), 401
        
        survey_data = sessions[session_id]['survey_data']
        credentials = sessions[state]['credentials']
        
        # Google Forms 생성
        result = create_google_form(survey_data, credentials)
        
        return jsonify({
            'success': True,
            'form_id': result['form_id'],
            'edit_url': result['edit_url'],
            'response_url': result['response_url']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
