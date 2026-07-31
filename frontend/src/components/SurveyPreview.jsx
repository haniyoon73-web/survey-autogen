import React, { useState } from 'react';
import './SurveyPreview.css';

function SurveyPreview({ survey, onNext, onBack }) {
  const [expandedSections, setExpandedSections] = useState(
    survey.sections.map((_, i) => i === 0)
  );

  const toggleSection = (index) => {
    const newExpanded = [...expandedSections];
    newExpanded[index] = !newExpanded[index];
    setExpandedSections(newExpanded);
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'multiple_choice': '객관식',
      'checkbox': '복수 선택',
      'scale': '척도형',
      'short_answer': '단답형',
      'paragraph': '서술형'
    };
    return labels[type] || type;
  };

  const totalQuestions = survey.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return (
    <div className="survey-preview-container">
      <div className="preview-header">
        <h2>📋 설문 내용 확인</h2>
        <div className="survey-info">
          <div className="info-stat">
            <span className="stat-label">섹션</span>
            <span className="stat-value">{survey.sections.length}개</span>
          </div>
          <div className="info-stat">
            <span className="stat-label">문항</span>
            <span className="stat-value">{totalQuestions}개</span>
          </div>
        </div>
      </div>

      <div className="survey-title-section">
        <h3>{survey.title}</h3>
        {survey.description && (
          <p className="survey-description">{survey.description}</p>
        )}
      </div>

      <div className="sections-container">
        {survey.sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="section-card">
            <div
              className="section-header"
              onClick={() => toggleSection(sectionIdx)}
            >
              <div className="section-title">
                <span className="section-toggle">
                  {expandedSections[sectionIdx] ? '▼' : '▶'}
                </span>
                <span className="section-name">{section.name}</span>
                <span className="question-count">
                  {section.questions.length}문항
                </span>
              </div>
              {section.description && (
                <p className="section-description">
                  {section.description}
                </p>
              )}
            </div>

            {expandedSections[sectionIdx] && (
              <div className="section-questions">
                {section.questions.map((question, qIdx) => (
                  <div key={qIdx} className="question-item">
                    <div className="question-header">
                      <span className="question-number">
                        {section.questions.slice(0, qIdx).filter(q => q.id <= question.id).length + 1}
                      </span>
                      <span className="question-text">{question.text}</span>
                      <span className="question-type">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                      {question.required && (
                        <span className="required-badge">필수</span>
                      )}
                    </div>

                    {question.options && question.options.length > 0 && (
                      <div className="question-options">
                        {question.type === 'checkbox' ? '☐' : '○'} 
                        {question.options.map((option, oIdx) => (
                          <div key={oIdx} className="option">
                            {question.type === 'checkbox' ? '☐' : '○'} {option}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'scale' && (
                      <div className="question-scale">
                        <div className="scale-info">
                          {question.scale_labels && (
                            <>
                              <span className="scale-label">
                                {question.scale_labels[0]}
                              </span>
                              <span className="scale-range">
                                {question.scale_start}~{question.scale_end}
                              </span>
                              <span className="scale-label">
                                {question.scale_labels[question.scale_labels.length - 1]}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="scale-visual">
                          {Array.from({ length: question.scale_end - question.scale_start + 1 }, (_, i) => (
                            <div key={i} className="scale-number">
                              {question.scale_start + i}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === 'short_answer' && (
                      <div className="answer-preview">
                        <input type="text" placeholder="단답형 응답" disabled />
                      </div>
                    )}

                    {question.type === 'paragraph' && (
                      <div className="answer-preview">
                        <textarea placeholder="서술형 응답" disabled></textarea>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="preview-actions">
        <button onClick={onBack} className="btn-secondary">
          ← 돌아가기
        </button>
        <button onClick={onNext} className="btn-primary btn-large">
          확인 후 Google Forms 생성 →
        </button>
      </div>
    </div>
  );
}

export default SurveyPreview;
