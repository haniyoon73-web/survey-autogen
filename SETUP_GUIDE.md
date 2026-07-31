# 📋 설문 자동 생성 웹앱 - 완전 설정 가이드

## 🎯 전체 흐름

```
1. Google Cloud 설정 (20-30분) ← 당신이 할 일
   ↓
2. API 키 발급 받기 (5분)
   ↓
3. 로컬에서 테스트 (10분)
   ↓
4. Vercel에 배포 (10분)
   ↓
5. 완료! 웹앱 사용 시작
```

---

## 📌 Phase 1: Google Cloud 설정

### **Step 1-1: Google Cloud 프로젝트 생성**

1. https://console.cloud.google.com 접속
2. 상단의 **"프로젝트 선택"** 클릭
3. **"새 프로젝트"** 선택
4. 프로젝트 이름: `survey-autogen` 입력
5. 생성 버튼 클릭
6. **프로젝트 ID 복사해두기** (나중에 필요)

### **Step 1-2: Google Forms API 활성화**

1. Google Cloud Console에서 좌측 메뉴 → **"API 및 서비스"**
2. **"라이브러리"** 클릭
3. 검색창에 `Google Forms API` 입력
4. 결과 클릭
5. **"활성화"** 버튼 클릭

### **Step 1-3: Google Drive API 활성화**

1. 라이브러리로 돌아가기
2. 검색창에 `Google Drive API` 입력
3. 결과 클릭
4. **"활성화"** 버튼 클릭

### **Step 1-4: OAuth 2.0 클라이언트 ID 생성**

1. **"API 및 서비스"** → **"사용자 인증 정보"**
2. **"사용자 인증 정보 만들기"** 클릭
3. **"OAuth 클라이언트 ID"** 선택
4. 애플리케이션 유형: **"웹 애플리케이션"** 선택
5. 이름: `survey-autogen-web` 입력
6. **"승인된 리디렉션 URI"** 추가:
   ```
   http://localhost:3000/auth/callback
   http://localhost:5000/auth/callback
   ```
   (Vercel 배포 후 실제 URL로 변경 필요)

7. **"만들기"** 클릭
8. **클라이언트 ID** 복사
9. **클라이언트 보안 비밀번호** 복사
10. JSON 다운로드 → `credentials.json` 저장

### **Step 1-5: 동의 화면 구성** (중요!)

1. **"API 및 서비스"** → **"OAuth 동의 화면"**
2. 사용자 유형: **"내부"** 선택 (병원 내부용이면)
3. **"만들기"** 클릭
4. 필수 정보 입력:
   - 앱 이름: `Survey Auto Generator`
   - 사용자 지원 이메일: `haniyoon@cmcnu.or.kr`
   - 개발자 연락처: `haniyoon@cmcnu.or.kr`
5. **"저장 및 계속"** 클릭

---

## 🔑 Phase 2: API 키 설정

### **Step 2-1: Claude API 키 발급**

1. https://console.anthropic.com 접속
2. 왼쪽 메뉴 → **"API Keys"**
3. **"Create Key"** 클릭
4. 키 이름: `survey-autogen` 입력
5. 생성된 키 **복사** (다시 볼 수 없음)

### **Step 2-2: 환경 변수 설정**

**로컬 테스트용 (.env 파일):**

```bash
# 백엔드 디렉토리에 .env 파일 생성
cd backend
cat > .env << EOF
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx (Claude API 키 붙여넣기)
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com (Google 클라이언트 ID)
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx (Google 클라이언트 보안 비밀번호)
GOOGLE_PROJECT_ID=survey-autogen (Google 프로젝트 ID)
FLASK_ENV=development
DEBUG=True
EOF
```

---

## 💻 Phase 3: 로컬 테스트

### **Step 3-1: 백엔드 설정**

```bash
cd backend

# Python 가상환경 생성
python -m venv venv

# 가상환경 활성화
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# credentials.json 파일 복사
cp /path/to/downloaded/credentials.json ./
```

### **Step 3-2: 백엔드 실행**

```bash
python app.py
# http://localhost:5000 에서 실행됨
```

### **Step 3-3: 프론트엔드 설정**

새 터미널 창:

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
# http://localhost:3000 에서 실행됨
```

### **Step 3-4: 테스트**

1. http://localhost:3000 접속
2. 워드나 PDF 파일 업로드
3. 설문 미리보기 확인
4. Google Forms 생성 버튼 클릭
5. Google 로그인 진행
6. 완료된 폼 링크 확인

---

## 🚀 Phase 4: Vercel 배포

### **Step 4-1: Vercel 계정 생성**

1. https://vercel.com 접속
2. GitHub 계정으로 가입 (또는 이메일)
3. 기본 설정 완료

### **Step 4-2: GitHub 저장소 생성**

```bash
# 프로젝트 루트에서
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourname/survey-autogen.git
git push -u origin main
```

### **Step 4-3: Vercel에서 배포**

**백엔드 배포:**

1. Vercel 대시보드 → "New Project"
2. GitHub 저장소 선택
3. Framework: Python
4. Environment Variables 설정:
   ```
   ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx
   GOOGLE_CLIENT_ID = xxxxxxxxxxxxx
   GOOGLE_CLIENT_SECRET = xxxxxxxxxxxxx
   GOOGLE_PROJECT_ID = survey-autogen
   ```
5. Deploy 클릭
6. 배포된 URL 복사 (예: https://survey-autogen-api.vercel.app)

**프론트엔드 배포:**

1. Vercel 대시보드 → "New Project"
2. GitHub 저장소 선택 (frontend 폴더)
3. Framework: Create React App
4. Environment Variables 설정:
   ```
   REACT_APP_API_URL = https://survey-autogen-api.vercel.app
   ```
5. Deploy 클릭

### **Step 4-4: OAuth Redirect URIs 업데이트**

Google Cloud Console에서:

1. **"API 및 서비스"** → **"사용자 인증 정보"**
2. OAuth 클라이언트 ID 수정
3. 승인된 리디렉션 URI에 추가:
   ```
   https://[frontend-url].vercel.app/auth/callback
   https://[backend-url].vercel.app/api/auth/callback
   ```
4. 저장

---

## ✅ 배포 후 확인 사항

- [ ] 프론트엔드 URL 접속 가능한가?
- [ ] 파일 업로드 가능한가?
- [ ] 설문 분석이 정상 작동하는가?
- [ ] Google Forms 생성이 가능한가?
- [ ] 생성된 폼 링크가 유효한가?

---

## 🐛 문제 해결

### "API 키가 유효하지 않습니다"
- Claude API 키가 올바른지 확인
- Vercel 환경 변수를 다시 확인

### "Google 인증 실패"
- OAuth 클라이언트 ID가 올바른지 확인
- 리디렉션 URI가 정확히 등록되었는지 확인
- 동의 화면이 구성되었는지 확인

### "파일 업로드 실패"
- 백엔드가 실행 중인지 확인
- CORS 설정이 올바른지 확인
- 파일 크기가 10MB 미만인지 확인

---

## 📞 지원 연락처

문제가 발생하면:
- 백엔드 로그 확인: `python app.py` 출력
- 브라우저 개발자 도구 (F12) → Console 확인
- 네트워크 탭에서 API 요청 확인

---

**축하합니다! 🎉 설문 자동 생성 웹앱이 준비되었습니다.**
