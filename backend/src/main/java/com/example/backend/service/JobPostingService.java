package com.example.backend.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
@ConditionalOnBean(EmbeddingModel.class)
public class JobPostingService {

    private final EmbeddingModel embeddingModel;
    private EmbeddingStore<TextSegment> embeddingStore;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    public JobPostingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    @PostConstruct
    public void init() {
        // PGVector 설정 (Docker-compose의 설정을 따름)
        // URL 예: jdbc:postgresql://localhost:5432/rag
        String host = "localhost";
        int port = 5432;
        String database = "rag";

        this.embeddingStore = PgVectorEmbeddingStore.builder()
                .host(host)
                .port(port)
                .database(database)
                .user(dbUsername)
                .password(dbPassword)
                .table("job_postings_vectors")
                .dimension(1536) // text-embedding-3-small의 차원
                .build();
    }

    /**
     * 채용 공고를 벡터 스토어에 저장합니다.
     */
    public void addJobPosting(String title, String company, String description) {
        String content = String.format("Title: %s\nCompany: %s\nDescription: %s", title, company, description);
        TextSegment segment = TextSegment.from(content);
        embeddingStore.add(embeddingModel.embed(segment).content(), segment);
    }

    /**
     * 이력서 텍스트와 유사한 채용 공고를 검색합니다.
     */
    public List<String> findSimilarJobs(String resumeText, int maxResults) {
        var embedding = embeddingModel.embed(resumeText).content();
        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()
                .queryEmbedding(embedding)
                .maxResults(maxResults)
                .build();
        EmbeddingSearchResult<TextSegment> result = embeddingStore.search(request);
        List<EmbeddingMatch<TextSegment>> matches = result.matches();

        return matches.stream()
                .map(match -> match.embedded().text())
                .collect(Collectors.toList());
    }
}
