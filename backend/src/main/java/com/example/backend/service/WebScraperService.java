package com.example.backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class WebScraperService {

    /**
     * URL에서 웹 페이지의 주요 텍스트 내용을 추출합니다.
     * 
     * @param url 채용 공고 페이지 URL
     * @return 추출된 텍스트 내용
     */
    public String scrapeJobPosting(String url) {
        try {
            // 웹 페이지 가져오기 (User-Agent 설정으로 봇 차단 우회 시도)
            Document doc = Jsoup.connect(url)
                    .userAgent(
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                    .get();

            // 본문 텍스트만 추출 (HTML 태그 제거)
            // 채용 사이트마다 구조가 다르므로 body 전체를 가져오되 검색 효율을 위해 공백 정리
            String bodyText = doc.body().text();

            // 너무 길 경우 분석이 어려울 수 있으므로 적절히 자르거나 전처리 가능
            // 여기서는 전체를 반환하되 LLM이 알아서 판단하게 함
            return bodyText;
        } catch (IOException e) {
            throw new RuntimeException("채용 공고 URL을 읽는 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
}
