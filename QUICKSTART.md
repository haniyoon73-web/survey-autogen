# 🚀 빠른 시작 가이드

> **예상 소요 시간: 당신이 할 일은 총 30분 정도입니다**

## 📋 당신이 해야 할 일 (Step-by-Step)

### **1️⃣ Google Cloud 설정 (20분)**

#### 1-1. 프로젝트 생성
```
https://console.cloud.google.com 
→ 프로젝트 선택 
→ 새 프로젝트 
→ "survey-autogen" 입력 
→ 생성
```

**프로젝트 ID를 어딘가에 메모해두세요** (예: survey-autogen-12345)

#### 1-2. API 활성화 (2개)
```
API 및 서비스 → 라이브러리

1) Google Forms API 검색 → 활성화
2) Google Drive API 검색 → 활성화
```

#### 1-3. OAuth 클라이언트 생성
```
API 및 서비스 → 사용자 인증 정보 
→ 사용자 인증 정보 만들기 
→ OAuth 클라이언트 ID 
→ 웹 애플리케이션
```

**이 값들을 복사해두세요:**
- 클라이언트 ID: `_______________`
- 클라이언트 보안 비밀번호: `_______________`

그리고 JSON 파일을 다운로드하여 `credentials.json`으로 저장

#### 1-4. OAuth 동의 화면 설정
```
API 및 서비스 → OAuth 동의 화면
→ 만들기
→ 앱 이름: "Survey Auto Generator"
→ 이메일: haniyoon@cmcnu.or.kr
→ 저장 및 계속
```

---

### **2️⃣ Claude API 키 받기 (2분)**

```
https://console.anthropic.com
→ API Keys 
→ Create Key
→ 키 복사: `sk-ant-_______________`
```

---

### **3️⃣ 로컬에서 테스트 (또는 스킵 가능)**

**터미널 1 (백엔드):**
```bash
cd backend

# .env 파일 생성 (아래 값들을 입력)
cat > .env << EOF
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
EOF

# 실행
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**터미널 2 (프론트엔드):**
```bash
cd frontend
npm install
npm start
```

브라우저에서 http://localhost:3000 접속 후 테스트

---

### **4️⃣ Vercel에 배포 (10분) - 선택 사항**

#### 4-1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/survey-autogen
git push -u origin main
```

#### 4-2. Vercel에서 배포
```
https://vercel.com
→ GitHub 연결
→ survey-autogen 저장소 선택
→ Environment Variables 설정:
   ANTHROPIC_API_KEY = sk-ant-xxxxx
   GOOGLE_CLIENT_ID = xxxxx
   GOOGLE_CLIENT_SECRET = xxxxx
→ Deploy
```

#### 4-3. Google OAuth 리디렉션 URI 업데이트
```
Google Cloud Console
→ 사용자 인증 정보
→ OAuth 클라이언트 ID 편집
→ 리디렉션 URI 추가:
   https://your-frontend.vercel.app/auth/callback
   https://your-backend.vercel.app/api/auth/callback
→ 저장
```

---

## 🎯 사용 방법

### **첫 번째 설문 생성**

1. 웹앱에 접속 (로컬 또는 Vercel)
2. Word/PDF 파일 드래그앤드롭
3. 자동으로 설문 구조 분석됨
4. 미리보기에서 확인
5. "Google Forms 생성" 버튼 클릭
6. Google 로그인
7. 완성된 폼의 링크 받기
8. 응답자들과 공유

---

## 📝 체크리스트

### 필수 항목
- [ ] Google Cloud 프로젝트 생성
- [ ] Forms API 활성화
- [ ] Drive API 활성화
- [ ] OAuth 클라이언트 생성
- [ ] Claude API 키 발급
- [ ] credentials.json 저장
- [ ] .env 파일 작성

### 선택 항목 (배포)
- [ ] GitHub 저장소 생성
- [ ] Vercel 배포
- [ ] OAuth 리디렉션 URI 업데이트

---

## 🐛 가장 흔한 문제

### "Google 로그인이 안 됨"
→ OAuth 리디렉션 URI가 정확히 등록되었는지 확인

### "파일 업로드가 안 됨"
→ 백엔드가 실행 중인지 확인 (python app.py)

### "Claude API 에러"
→ API 키가 올바른지 .env 파일 재확인

---

## 💡 팁

- 로컬에서 먼저 테스트한 후 Vercel에 배포하세요
- 프로덕션 배포 전에 샘플 설문으로 테스트하세요
- API 키는 절대 GitHub에 커밋하지 마세요 (.gitignore 확인)

---

**준비 완료되시면 웹앱을 사용하실 수 있습니다! 🎉**
