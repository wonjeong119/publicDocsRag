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
                "당신은 전문 채용 담당자이자 커리어 컨설턴트입니다. 아래의 [이력서]와 [채용 공고]를 심층 분석하여 JSON 형식으로 피드백을 주세요.\n\n" +
                        "반드시 아래의 JSON 구조를 지켜야 하며, 다른 텍스트 없이 JSON만 응답하세요:\n" +
                        "{\n" +
                        "  \"matchScore\": 숫자 (0-100),\n" +
                        "  \"heroTitle\": \"[지원서 제목]\",\n" +
                        "  \"heroName\": \"[지원자 이름]\",\n" +
                        "  \"heroDescriptionShort\": \"짧은 강조 설명\",\n" +
                        "  \"heroDescriptionLong\": \"상세 요약 설명\",\n" +
                        "  \"strengths\": [\n" +
                        "    { \"title\": \"강점 제목\", \"description\": \"강점 상세 설명\", \"fullWidth\": true/false }\n" +
                        "  ],\n" +
                        "  \"improvements\": [\n" +
                        "    { \"title\": \"보완점 제목\", \"description\": \"보완점 상세 설명\" }\n" +
                        "  ],\n" +
                        "  \"strategies\": [\n" +
                        "    { \"title\": \"전략 제목\", \"bullets\": [\"포인트1\", \"포인트2\"], \"quote\": \"인용구\", \"paragraph\": \"설명\" }\n"
                        +
                        "  ]\n" +
                        "}\n\n" +
                        "[이력서 내용]\n%s\n\n" +
                        "--------------------------\n\n" +
                        "[채용 공고 내용 (URL: %s)]\n%s\n",
                resumeText,
                jobUrl,
                jobDescription);

        if (!llmEnabled || chatApiKey.isEmpty() || chatModel == null) {
            return "{\"error\": \"LLM is disabled or API key is missing.\"}";
        }

        try {
            String response = chatModel.chat(prompt);
            if (response.contains("```json")) {
                response = response.substring(response.indexOf("```json") + 7);
                response = response.substring(0, response.lastIndexOf("```"));
            } else if (response.contains("```")) {
                response = response.substring(response.indexOf("```") + 3);
                response = response.substring(0, response.lastIndexOf("```"));
            }
            return response.trim();
        } catch (RuntimeException e) {
            return "{\"error\": \"LLM request failed: " + e.getMessage() + "\"}";
        }
    }
}
