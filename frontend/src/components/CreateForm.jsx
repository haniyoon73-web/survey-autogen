import React, { useEffect, useState } from 'react';
import './CreateForm.css';

function CreateForm({ onCreateForm, onBack }) {
  const [authUrl, setAuthUrl] = useState(null);
  const [authState, setAuthState] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    const code = params.get('code');

    if (state && code) {
      // 콜백 URL에서 돌아온 경우
      completeAuth(state, code);
    }
  }, []);

  const startAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('인증 URL 생성 실패');
      }

      const data = await response.json();
      setAuthUrl(data.auth_url);
      
      // 새 탭에서 인증 URL 열기
      window.open(data.auth_url, 'auth', 'width=800,height=600');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeAuth = async (state, code) => {
    try {
      // 서버에서 토큰 교환
      const response = await fetch('http://localhost:5000/api/auth/callback', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${code}`
        }
      });

      if (!response.ok) {
        throw new Error('인증 완료 실패');
      }

      setAuthState(state);
      setIsAuthorized(true);

      // URL에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateForm = async () => {
    if (!authState) {
      setError('인증이 필요합니다');
      return;
    }

    await onCreateForm(authState);
  };

  return (
    <div className="create-form-container">
      <div className="create-form-card">
        <h2>🔐 Google Forms 생성</h2>
        <p className="subtitle">
          Google 계정으로 인증한 후 설문지를 생성합니다
        </p>

        <div className="auth-status">
          {!isAuthorized ? (
            <div className="status-pending">
              <div className="status-icon">🔒</div>
              <h3>Google 인증 필요</h3>
              <p>
                설문지를 생성하기 위해 Google 계정으로 로그인이 필요합니다.
              </p>
              <p className="status-subtitle">
                아래 버튼을 클릭하면 Google 로그인 페이지가 새 탭에서 열립니다.
              </p>

              <button
                onClick={startAuth}
                disabled={loading}
                className="btn-google btn-large"
              >
                {loading ? '처리 중...' : '🔗 Google로 로그인'}
              </button>

              <div className="auth-info">
                <h4>ℹ️ 보안 정보</h4>
                <ul>
                  <li>Google 계정 정보는 설문 생성에만 사용됩니다</li>
                  <li>로그인 후 생성된 설문지를 관리할 수 있습니다</li>
                  <li>언제든 Google 계정 설정에서 앱 권한을 해제할 수 있습니다</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="status-authorized">
              <div className="status-icon">✅</div>
              <h3>인증 완료</h3>
              <p>Google 계정으로 로그인되었습니다.</p>
              <p className="status-subtitle">
                이제 Google Forms 설문지를 생성할 준비가 되었습니다.
              </p>

              <button
                onClick={handleCreateForm}
                className="btn-primary btn-large"
              >
                📋 Google Forms 생성하기
              </button>

              <div className="create-info">
                <h4>⚙️ 생성 과정</h4>
                <ol>
                  <li>설문 제목과 설명이 포함된 새 폼 생성</li>
                  <li>모든 섹션과 문항이 자동으로 추가</li>
                  <li>생성된 폼의 링크 제공 (편집/공유 가능)</li>
                  <li>링크를 클릭하여 추가 편집 가능</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="form-actions">
          <button onClick={onBack} className="btn-secondary">
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateForm;
