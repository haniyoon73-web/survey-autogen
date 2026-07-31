import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        alert('DOCX 또는 PDF 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        alert('DOCX 또는 PDF 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-card">
        <h2>📂 설문 파일 업로드</h2>
        <p className="subtitle">Word(.docx) 또는 PDF 파일을 선택해주세요</p>

        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="drop-zone-content">
            <div className="drop-icon">📄</div>
            <h3>파일을 여기에 드래그하거나</h3>
            <label htmlFor="file-input" className="file-label">
              클릭하여 선택
            </label>
            <input
              id="file-input"
              type="file"
              accept=".docx,.pdf"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {selectedFile && (
          <div className="selected-file">
            <div className="file-info">
              <span className="file-icon">📋</span>
              <div className="file-details">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="btn-remove"
            >
              ✕
            </button>
          </div>
        )}

        <div className="upload-info">
          <h4>💡 팁:</h4>
          <ul>
            <li>지원 형식: Word(.docx), PDF</li>
            <li>파일 크기: 최대 10MB</li>
            <li>자동으로 설문 구조를 분석합니다</li>
            <li>사용자 정보는 저장되지 않습니다</li>
          </ul>
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            className="btn-upload btn-large"
          >
            🚀 파일 분석 시작
          </button>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
