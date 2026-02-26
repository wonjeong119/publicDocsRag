import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalyzePage.css';
import AnalyzeRawResponse from '../components/AnalyzeRawResponse';

const AnalyzePage: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileError, setFileError] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analyzeRawResponse, setAnalyzeRawResponse] = useState('');

    const handleBrowseClick = () => {
        if (selectedFileName) {
            setFileError('이력서는 1건만 업로드할 수 있습니다. 파일 제거 후 다시 선택해 주세요.');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleClearSelectedFile = () => {
        setSelectedFile(null);
        setSelectedFileName('');
        setFileError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleResumeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        const extension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['pdf', 'doc', 'docx'];

        if (!extension || !allowedExtensions.includes(extension)) {
            setSelectedFile(null);
            setSelectedFileName('');
            setFileError('PDF, DOC, DOCX 파일만 업로드할 수 있습니다.');
            event.target.value = '';
            return;
        }

        if (file.size > maxSize) {
            setSelectedFile(null);
            setSelectedFileName('');
            setFileError('파일 크기는 5MB 이하여야 합니다.');
            event.target.value = '';
            return;
        }

        setSelectedFile(file);
        setSelectedFileName(file.name);
        setFileError('');
    };

    const handleAnalyzeClick = async () => {
        setSubmitError('');
        setAnalyzeRawResponse('');

        if (!selectedFile) {
            setSubmitError('이력서 파일을 먼저 업로드해 주세요.');
            return;
        }

        if (!jobUrl.trim()) {
            setSubmitError('채용 공고 URL을 입력해 주세요.');
            return;
        }

        try {
            const parsedUrl = new URL(jobUrl);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                setSubmitError('URL은 http 또는 https로 시작해야 합니다.');
                return;
            }
        } catch {
            setSubmitError('올바른 URL 형식이 아닙니다.');
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('url', jobUrl.trim());

            const response = await fetch('/api/recommend/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const rawBody = await response.text();
            if (!rawBody) {
                setAnalyzeRawResponse('응답 본문이 비어 있습니다.');
                return;
            }

            try {
                const parsedData = JSON.parse(rawBody);
                if (parsedData.error) {
                    setSubmitError(`분석 중 오류가 발생했습니다: ${parsedData.error}`);
                    return;
                }
                // 결과 페이지로 데이터 전달하며 이동
                navigate('/result', { state: { resultData: parsedData } });
            } catch (jsonError) {
                console.error('JSON parsing failed:', jsonError);
                setAnalyzeRawResponse(rawBody);
                setSubmitError('분석 결과 형식이 올바르지 않습니다. 원문을 확인해 주세요.');
            }
        } catch (error) {
            console.error('Analyze request failed:', error);
            setSubmitError(`분석 요청에 실패했습니다. (${String(error)})`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="analyze-page">
            <header className="analyze-header">
                <div className="analyze-header-inner">
                    <div className="analyze-brand">
                        <span className="material-symbols-outlined analyze-brand-icon">analytics</span>
                        <h1 className="analyze-brand-title">AI 이력 비교 리포트</h1>
                    </div>
                </div>
            </header>

            <main className="analyze-main">
                <div className="analyze-intro">
                    <h2 className="analyze-intro-title">커리어 분석 시작하기</h2>
                    <p className="analyze-intro-desc">이력서와 채용 공고를 비교하여 빠진 경험을 찾고 합격 확률을 높여보세요.</p>
                </div>

                <div className="analyze-form-grid">
                    <div className="input-card analyze-card">
                        <div className="input-card-head">
                            <span className="material-symbols-outlined input-card-icon">description</span>
                            <h3 className="input-card-title">1. 이력서 업로드</h3>
                        </div>
                        <div className="drop-zone analyze-drop-zone">
                            <span className="material-symbols-outlined drop-zone-icon">cloud_upload</span>
                            <p className="drop-zone-title">이력서를 여기로 끌어오거나 올려보세요</p>
                            <p className="drop-zone-subtitle">PDF, DOCX 파일 지원 (최대 5MB)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="sr-only-file-input"
                                onChange={handleResumeFileChange}
                            />
                            <button type="button" className="drop-zone-button" onClick={handleBrowseClick}>
                                내 PC에서 파일 찾기
                            </button>
                            {selectedFileName && <p className="drop-zone-file-name">{selectedFileName}</p>}
                            {selectedFileName && (
                                <button type="button" className="drop-zone-clear-button" onClick={handleClearSelectedFile}>
                                    파일 제거
                                </button>
                            )}
                            {fileError && <p className="drop-zone-file-error">{fileError}</p>}
                        </div>
                    </div>

                    <div className="input-card analyze-card">
                        <div className="input-card-head">
                            <span className="material-symbols-outlined input-card-icon">link</span>
                            <h3 className="input-card-title">2. 채용 공고 링크</h3>
                        </div>
                        <div className="job-field">
                            <label className="job-field-label" htmlFor="job-url">
                                분석할 채용 공고 주소를 붙여넣어 주세요
                            </label>
                            <div className="job-field-input-wrap">
                                <input
                                    className="job-field-input"
                                    id="job-url"
                                    placeholder="예: 채용 사이트 공고 URL 또는 기업 채용 페이지"
                                    type="url"
                                    value={jobUrl}
                                    onChange={(event) => setJobUrl(event.target.value)}
                                />
                                <span className="material-symbols-outlined job-field-icon">language</span>
                            </div>
                            <p className="job-field-help">
                                입력하신 주소에서 AI가 직무 설명, 필수 역량 및 자격 요건을 자동으로 분석하여 리포트에 반영합니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="analyze-cta-wrap">
                    <button type="button" className="analyze-cta-btn" onClick={handleAnalyzeClick} disabled={isSubmitting}>
                        {isSubmitting ? '분석 요청 중...' : 'AI 이력 분석 시작하기'}
                    </button>
                    {submitError && <p className="analyze-submit-error">{submitError}</p>}
                    <AnalyzeRawResponse response={analyzeRawResponse} />
                </div>
                <div className="analyze-steps">
                    <p className="analyze-steps-title">분석 진행 단계</p>
                    <div className="analyze-steps-grid">
                        <div className="step-item">
                            <div className="step-num">1</div>
                            <p className="step-title">이력서 제출</p>
                            <p className="step-desc">분석에 사용할 이력서를 업로드합니다</p>
                        </div>
                        <div className="step-item">
                            <div className="step-num">2</div>
                            <p className="step-title">공고 입력</p>
                            <p className="step-desc">비교할 공고의 상세 주소를 입력합니다</p>
                        </div>
                        <div className="step-item">
                            <div className="step-num">3</div>
                            <p className="step-title">리포트 생성</p>
                            <p className="step-desc">AI가 분석한 정보를 리포트로 확인합니다</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="analyze-footer">
                <div className="analyze-footer-inner">
                    <p className="analyze-footer-text">AI 커리어 분석 엔진 v2.4</p>
                    <div className="analyze-footer-links">
                        <a className="analyze-footer-link" href="#">개인정보 처리방침</a>
                        <a className="analyze-footer-link" href="#">이용약관</a>
                        <a className="analyze-footer-link" href="#">고객 지원</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AnalyzePage;


