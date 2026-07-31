# 📋 설문 자동 생성 웹앱 (Survey Auto Generator)

> Word/PDF 설문을 **Google Forms로 자동 변환하는 웹 애플리케이션**

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![React](https://img.shields.io/badge/react-18+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 주요 기능

✅ **자동 설문 분석** - Word/PDF 파일에서 설문 구조를 자동으로 추출  
✅ **Google Forms 자동 생성** - 추출된 내용으로 즉시 구글폼 생성  
✅ **미리보기** - 생성 전에 설문 내용 확인  
✅ **OAuth 인증** - Google 계정으로 안전하게 인증  
✅ **클라우드 배포** - Vercel로 무료 배포 가능  

---

## 🏗️ 기술 스택

### 프론트엔드
- **React 18** - UI 프레임워크
- **CSS3** - 스타일링
- **Fetch API** - API 통신

### 백엔드
- **Flask** - Python 웹 프레임워크
- **Claude API (Anthropic)** - 설문 내용 분석
- **Google Forms API** - 설문지 자동 생성
- **Google Drive API** - 파일 관리
- **python-docx** - Word 파일 처리
- **PyPDF2** - PDF 파일 처리

### 인프라
- **Vercel** - 프론트엔드 호스팅
- **Vercel** - 백엔드 호스팅 (또는 Google Cloud Run)
- **Google Cloud** - OAuth 및 API 관리

---

## 📁 프로젝트 구조

```
survey-autogen/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── App.jsx              # 메인 앱 컴포넌트
│   │   ├── App.css              # 메인 스타일
│   │   └── components/          # 컴포넌트들
│   │       ├── FileUpload.jsx    # 파일 업로드
│   │       ├── SurveyPreview.jsx # 설문 미리보기
│   │       ├── CreateForm.jsx    # 폼 생성
│   │       └── [각 .css 파일들]
│   ├── package.json
│   └── vercel.json              # Vercel 배포 설정
│
├── backend/                     # Flask 백엔드
│   ├── app.py                   # 메인 애플리케이션
│   ├── requirements.txt          # Python 의존성
│   ├── .env.example             # 환경 변수 템플릿
│   ├── vercel.json              # Vercel 배포 설정
│   └── credentials.json         # Google OAuth 키 (생성 필요)
│
├── QUICKSTART.md                # 빠른 시작 가이드 ⭐ 먼저 읽기
├── SETUP_GUIDE.md               # 상세 설정 가이드
└── README.md                    # 이 파일

```

---

## 🚀 시작하기

### 필수 준비물
- Python 3.9 이상
- Node.js 14 이상
- Google Cloud 계정
- Claude API 키 (Anthropic)
- GitHub 계정 (배포용)

### 3가지 방법

#### **방법 1️⃣: 가장 쉬움 - Vercel에서 바로 사용 (권장)**

1. **Google Cloud 설정** - QUICKSTART.md의 1️⃣, 2️⃣, 3️⃣ 단계만 진행
2. **배포** - 제공된 설정으로 자동 배포
3. **사용** - 생성된 URL에서 바로 시작

> 전체 소요 시간: **30분**

#### **방법 2️⃣: 로컬에서 개발하면서 사용**

```bash
# 1. 저장소 클론
git clone https://github.com/yourname/survey-autogen
cd survey-autogen

# 2. 백엔드 설정
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# 3. 프론트엔드 설정 (새 터미널)
cd frontend
npm install
npm start

# 4. 브라우저에서 http://localhost:3000 열기
```

#### **방법 3️⃣: Docker로 실행**

```bash
docker-compose up
# http://localhost:3000에서 접속
```

---

## 📚 사용 방법

### 첫 번째 설문 생성

1. **파일 업로드**
   - Word(.docx) 또는 PDF 파일 선택
   - 드래그앤드롭으로 업로드

2. **자동 분석**
   - Claude AI가 설문 구조를 자동으로 분석
   - 섹션, 문항, 선택지 등을 추출

3. **미리보기**
   - 추출된 설문 내용 확인
   - 필요시 수정 가능 (향후 기능)

4. **Google Forms 생성**
   - Google 계정으로 로그인
   - "생성" 버튼 클릭
   - 완성된 폼의 링크 받기

5. **공유 및 응답 수집**
   - 응답 링크를 응답자들과 공유
   - Google Forms에서 응답 관리

---

## 🔧 설정

### 환경 변수 (.env)

```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Google Cloud
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx
GOOGLE_PROJECT_ID=survey-autogen

# 개발 환경
FLASK_ENV=development
DEBUG=True
```

### Google OAuth 리디렉션 URI

배포 후에는 다음과 같이 업데이트:

```
http://localhost:3000/auth/callback          (로컬 테스트)
http://localhost:5000/api/auth/callback     (로컬 테스트)
https://survey-autogen.vercel.app/auth/callback       (프로덕션)
https://survey-autogen-api.vercel.app/api/auth/callback (프로덕션)
```

---

## 🔐 보안

- **API 키**: 절대 GitHub에 커밋하지 마세요
- **CORS**: 신뢰할 수 있는 도메인만 허용
- **OAuth**: Google 계정으로 안전하게 인증
- **파일 처리**: 업로드된 파일은 분석 후 즉시 삭제

---

## 📊 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| POST | `/api/upload` | 파일 업로드 및 분석 |
| POST | `/api/auth/google` | Google OAuth 인증 시작 |
| GET | `/api/auth/callback` | OAuth 콜백 처리 |
| POST | `/api/create-form` | Google Forms 생성 |
| GET | `/api/health` | 상태 확인 |

---

## 🐛 문제 해결

### 자주 묻는 질문

**Q: 파일이 업로드가 안 됨**
- A: 백엔드가 실행 중인지 확인하세요 (`python app.py`)
- CORS 설정을 확인하세요

**Q: Google 로그인이 실패함**
- A: OAuth 리디렉션 URI가 정확히 등록되었는지 확인
- 동의 화면이 구성되었는지 확인

**Q: Claude API 에러**
- A: API 키가 올바른지 확인
- .env 파일이 올바르게 작성되었는지 확인

**Q: 생성된 폼이 비어있음**
- A: Claude가 설문 구조를 제대로 인식하지 못한 경우
- 파일의 형식을 확인하고 다시 시도

---

## 🚀 배포

### Vercel에 배포

**1. GitHub에 코드 푸시**
```bash
git push origin main
```

**2. Vercel에서 연결**
- https://vercel.com → GitHub 저장소 선택
- Environment Variables 설정
- Deploy

**3. Google Cloud에서 OAuth URI 업데이트**
- 배포된 URL을 Google OAuth 설정에 추가

---

## 📈 성능

- **파일 분석**: 평균 3-5초 (Claude API)
- **Forms 생성**: 평균 2-3초 (Google API)
- **전체 프로세스**: 평균 8-10초

---

## 💰 비용

### 월별 예상 비용

| 서비스 | 가격 | 비용 |
|--------|------|------|
| Claude API | 입력: $3/M 토큰 | ~$0.01 per form |
| Google Forms API | 무료 | $0 |
| Vercel 호스팅 | 무료 (Pro $20) | $0 |
| **총계** | | **~$1-5/월** |

---

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🤝 기여

버그 리포트와 개선 제안은 이슈 또는 PR로 제출해주세요.

---

## 📞 지원

문제가 발생하면:
1. **QUICKSTART.md** 다시 확인
2. **SETUP_GUIDE.md**의 문제 해결 섹션 확인
3. 백엔드 로그 확인 (`python app.py` 출력)
4. 브라우저 개발자 도구 확인 (F12)

---

**🎉 축하합니다! 설문 자동 생성 웹앱이 준비되었습니다.**

**지금 바로 [QUICKSTART.md](./QUICKSTART.md)를 읽고 시작하세요!**
