import React from 'react';

type AnalyzeRawResponseProps = {
    response: string;
};

const AnalyzeRawResponse: React.FC<AnalyzeRawResponseProps> = ({ response }) => {
    if (!response) return null;

    return (
        <section className="analyze-response-panel">
            <h3 className="analyze-response-title">분석 응답 원문</h3>
            <pre className="analyze-response-body">{response}</pre>
        </section>
    );
};

export default AnalyzeRawResponse;
