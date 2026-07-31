import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import SurveyPreview from './components/SurveyPreview';
import CreateForm from './components/CreateForm';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload -> preview -> create -> complete
  const [sessionId, setSessionId] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formResult, setFormResult] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setSurveyData(data.survey);
      setCurrentStep('preview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (state) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/create-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          state: state
        })
      });

      if (!response.ok) {
        throw new Error('구글폼 생성 실패');
      }

      const data = await response.json();
      setFormResult(data);
      setCurrentStep('complete');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setSessionId(null);
    setSurveyData(null);
    setFormResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 설문 자동 생성기</h1>
        <p>Word/PDF 설문을 Google Forms로 자동 변환</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            ❌ {error}
            <button onClick={() => setError(null)}>닫기</button>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>처리 중...</p>
          </div>
        )}

        {currentStep === 'upload' && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}

        {currentStep === 'preview' && surveyData && (
          <SurveyPreview 
            survey={surveyData} 
            onNext={() => setCurrentStep('create')}
            onBack={handleReset}
          />
        )}

        {currentStep === 'create' && (
          <CreateForm 
            onCreateForm={handleCreateForm}
            onBack={() => setCurrentStep('preview')}
          />
        )}

        {currentStep === 'complete' && formResult && (
          <div className="completion-screen">
            <div className="success-icon">✅</div>
            <h2>설문지 생성 완료!</h2>
            
            <div className="result-cards">
              <div className="result-card">
                <h3>📝 설문지 편집</h3>
                <p>설문지를 추가로 편집하려면 아래 링크를 클릭하세요.</p>
                <a 
                  href={formResult.edit_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  편집 링크 열기
                </a>
              </div>
              
              <div className="result-card">
                <h3>📊 응답 수집</h3>
                <p>이 링크를 응답자들과 공유하세요.</p>
                <a 
                  href={formResult.response_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  응답 링크 열기
                </a>
              </div>
            </div>

            <div className="form-id-display">
              <label>폼 ID:</label>
              <input 
                type="text" 
                value={formResult.form_id} 
                readOnly 
              />
              <button 
                onClick={() => navigator.clipboard.writeText(formResult.form_id)}
                className="btn-copy"
              >
                복사
              </button>
            </div>

            <button 
              onClick={handleReset}
              className="btn-reset"
            >
              새로운 설문 생성
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>🔐 개인 정보 보호: 업로드한 파일은 설문 분석에만 사용되며 저장되지 않습니다.</p>
      </footer>
    </div>
  );
}

export default App;
