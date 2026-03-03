package com.example.backend.controller;

import com.example.backend.service.RecommendationService;
import com.example.backend.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/recommend")
public class RecommendationController {

    private final ResumeService resumeService;
    private final RecommendationService recommendationService;

    public RecommendationController(ResumeService resumeService,
            RecommendationService recommendationService) {
        this.resumeService = resumeService;
        this.recommendationService = recommendationService;
    }

    /**
     * 이력서 PDF와 채용 공고 URL을 받아 매칭 분석을 수행합니다.
     * 
     * @param file 이력서 PDF 파일
     * @param url  채용 공고 페이지 URL
     * @return LLM 분석 결과 리포트
     */
    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeMatch(
            @RequestParam("file") MultipartFile file,
            @RequestParam("url") String url,
            @RequestParam(value = "apiKey", required = false) String apiKey) {

        // 1. 이력서에서 텍스트 추출
        String resumeText = resumeService.extractTextFromPdf(file);

        // 2. URL 공고와 비교 분석
        String analysisResult = recommendationService.analyzeMatch(resumeText, url, apiKey);

        return ResponseEntity.ok(analysisResult);
    }
}
