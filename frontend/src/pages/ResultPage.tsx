import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResultPage.css';

const ResultPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleSaveReport = () => window.print();

    const resultData = location.state?.resultData;

    useEffect(() => {
        if (!resultData) {
            console.warn('No result data found. Redirecting to home...');
            navigate('/');
        }
    }, [resultData, navigate]);

    if (!resultData) {
        return <div className="loading-screen">데이터를 불러오는 중...</div>;
    }

    const {
        matchScore = 0,
        heroTitle = '[직무 분석]',
        heroName = '[지원자]',
        heroDescriptionShort = '',
        heroDescriptionLong = '',
        strengths = [],
        improvements = [],
        strategies = []
    } = resultData;

    const scoreDashOffset = 452.3 * (1 - matchScore / 100);

    const getScoreLabel = (score: number) => {
        if (score >= 90) return '최고 수준';
        if (score >= 80) return '매우 높음';
        if (score >= 70) return '높음';
        if (score >= 60) return '보통';
        return '보충 필요';
    };

    return (
        <div className="result-page">
            <header className="result-header glass-effect">
                <div className="result-header-inner">
                    <div className="result-brand">
                        <div className="result-brand-icon-box">
                            <span className="material-symbols-outlined result-brand-icon">insights</span>
                        </div>
                        <div className="result-brand-text-wrap">
                            <p className="result-brand-tag">AI 커리어 분석 플랫폼</p>
                            <h1 className="result-brand-title">AI 심층 비평 리포트</h1>
                        </div>
                    </div>
                    <div className="result-header-actions">
                        <button className="result-btn result-btn-secondary" onClick={handleSaveReport}>
                            <span className="material-symbols-outlined result-btn-icon">ios_share</span>
                            리포트 저장
                        </button>
                        <button onClick={() => navigate('/')} className="result-btn result-btn-primary">
                            <span className="material-symbols-outlined result-btn-icon">add_circle</span>
                            새 분석 시작
                        </button>
                    </div>
                </div>
            </header>

            <main className="result-main">
                <section className="report-card hero-card">
                    <div className="hero-orb"></div>
                    <div className="hero-content">
                        <div className="score-wrap">
                            <svg className="score-svg" viewBox="0 0 160 160">
                                <circle className="score-track" cx="80" cy="80" fill="transparent" r="72" stroke="currentColor" strokeWidth="12"></circle>
                                <circle className="score-value" cx="80" cy="80" fill="transparent" r="72" stroke="currentColor" strokeDasharray="452.3" strokeDashoffset={scoreDashOffset} strokeLinecap="round" strokeWidth="12"></circle>
                            </svg>
                            <div className="score-center">
                                <span className="score-label">매칭 점수</span>
                                <span className="score-number">{matchScore}<span className="score-total">/100</span></span>
                                <span className="score-pill">{getScoreLabel(matchScore)}</span>
                            </div>
                        </div>
                        <div className="hero-text">
                            <h2 className="hero-title">
                                {heroTitle} <br className="hero-title-break" />
                                <span className="hero-title-name">({heroName}님)</span>
                            </h2>
                            <div className="hero-copy">
                                {heroDescriptionShort && (
                                    <p className="highlight-text-box">
                                        <span className="highlight-green">{heroDescriptionShort}</span>
                                    </p>
                                )}
                                <p>{heroDescriptionLong}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="report-card" id="strengths">
                    <div className="section-head section-head-strength">
                        <div className="section-head-left">
                            <span className="material-symbols-outlined section-head-icon section-head-icon-strength">workspace_premium</span>
                            <h3 className="section-title section-title-strength">강점 분석</h3>
                        </div>
                        <span className="section-count section-count-strength">{strengths.length}가지 핵심 역량</span>
                    </div>
                    <div className="section-body strength-body">
                        <div className="strength-grid">
                            {strengths.map((item: any, idx: number) => (
                                <div key={idx} className={item.fullWidth ? 'strength-item strength-item-full' : 'strength-item'}>
                                    <h4 className="strength-item-title">
                                        <span className="strength-dot"></span>
                                        {item.title}
                                    </h4>
                                    <p className="strength-item-desc">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="report-card" id="improvement">
                    <div className="section-head section-head-improvement">
                        <div className="section-head-left">
                            <span className="material-symbols-outlined section-head-icon section-head-icon-improvement">analytics</span>
                            <h3 className="section-title">개선 필요 항목</h3>
                        </div>
                        <span className="section-meta">{improvements.length}가지 보완 필요</span>
                    </div>
                    <div className="section-body improvement-grid">
                        {improvements.map((item: any, idx: number) => (
                            <div key={idx} className="improvement-item">
                                <span className="improvement-index">{String(idx + 1).padStart(2, '0')}</span>
                                <div>
                                    <h4 className="improvement-title">{item.title}</h4>
                                    <p className="improvement-desc">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="report-card" id="strategy">
                    <div className="strategy-head">
                        <div className="strategy-head-icon-wrap">
                            <span className="material-symbols-outlined strategy-head-icon">lightbulb</span>
                        </div>
                        <div>
                            <h3 className="strategy-head-title">합격 전략 가이드</h3>
                            <p className="strategy-head-subtitle">AI가 제안하는 서류 합격률 극대화 로드맵</p>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="strategy-timeline">
                            <div className="strategy-line"></div>
                            {strategies.map((item: any, idx: number) => (
                                <div key={idx} className="strategy-item">
                                    <div className={idx === 0 ? 'strategy-marker strategy-marker-primary' : idx === 1 ? 'strategy-marker strategy-marker-secondary' : 'strategy-marker strategy-marker-tertiary'}>
                                        {idx + 1}
                                    </div>
                                    <div className="strategy-content">
                                        <h4 className="strategy-title">{item.title}</h4>
                                        {item.bullets && Array.isArray(item.bullets) && (
                                            <ul className="strategy-bullet-list">
                                                {item.bullets.map((bullet: string, bulletIdx: number) => (
                                                    <li key={bulletIdx} className="strategy-bullet-item">
                                                        <span className="material-symbols-outlined strategy-bullet-icon">check_circle</span>
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {item.quote && (
                                            <div className="strategy-quote-box">
                                                <p className="strategy-quote">"{item.quote}"</p>
                                            </div>
                                        )}
                                        {item.paragraph && <p className="strategy-paragraph">{item.paragraph}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="result-footer">
                <div className="result-footer-inner">
                    <div className="result-footer-left">
                        <div className="result-footer-brandline">
                            <span className="material-symbols-outlined result-footer-icon">auto_awesome</span>
                            <p className="result-footer-version">인사이트 리포트 엔진 버전 2.4</p>
                        </div>
                        <p className="result-footer-desc">본 리포트는 인공지능 분석을 통해 생성되었습니다. 정보의 정확성을 위해 실제 공고와 대조를 권장합니다.</p>
                    </div>
                    <div className="result-footer-actions">
                        <button className="result-footer-link">이용약관</button>
                        <button className="result-footer-link">시스템 피드백</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ResultPage;

