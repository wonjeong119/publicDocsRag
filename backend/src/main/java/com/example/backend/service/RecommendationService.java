package com.example.backend.service;

import dev.langchain4j.model.chat.ChatModel;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final ResumeService resumeService;
    private final WebScraperService webScraperService;
    private final ChatModel chatModel;
    private final boolean llmEnabled;
    private final String chatApiKey;

    public RecommendationService(ResumeService resumeService,
            WebScraperService webScraperService,
            ObjectProvider<ChatModel> chatModelProvider,
            @Value("${app.llm.enabled:true}") boolean llmEnabled,
            @Value("${langchain4j.google-ai-gemini.chat-model.api-key:}") String chatApiKey) {
        this.resumeService = resumeService;
        this.webScraperService = webScraperService;
        this.chatModel = chatModelProvider.getIfAvailable();
        this.llmEnabled = llmEnabled;
        this.chatApiKey = chatApiKey == null ? "" : chatApiKey.trim();
    }

    /**
     * 이력서와 웹 URL의 공고를 비교하여 분석 결과를 반환합니다.
     */
    public String analyzeMatch(String resumeText, String jobUrl) {
        // 1. URL에서 공고 내용 추출
        String jobDescription = webScraperService.scrapeJobPosting(jobUrl);

        // 2. LLM을 이용한 분석 및 추천 메시지 생성
        String prompt = String.format(
                "당신은 전문 채용 담당자이자 커리어 컨설턴트입니다. 아래의 [이력서]와 [채용 공고]를 심층 비로그 분석하여 피드백을 주세요.\n\n" +
                        "분석 내용에는 다음이 포함되어야 합니다:\n" +
                        "1. **매칭 점수**: 0점부터 100점 사이로 평가\n" +
                        "2. **강점**: 이력서에서 해당 공고의 요구사항에 잘 부합하는 부분\n" +
                        "3. **보완점**: 공고의 요구사항 중 부족한 부분이나 강조하면 좋을 경험\n" +
                        "4. **합격 전략**: 면접이나 서류 전형에서 강조해야 할 핵심 포인트\n\n" +
                        "[이력서 내용]\n%s\n\n" +
                        "--------------------------\n\n" +
                        "[채용 공고 내용 (URL: %s)]\n%s\n",
                resumeText,
                jobUrl,
                jobDescription);

        if (!llmEnabled || chatApiKey.isEmpty() || chatModel == null) {
            return "LLM is disabled or API key is missing. " +
                    "Set APP_LLM_ENABLED=true and GEMINI_AI_KEY to enable analysis.";
        }

        try {
            return chatModel.chat(prompt);
        } catch (RuntimeException e) {
            return "LLM request failed: " + e.getMessage();
        }
    }
}
