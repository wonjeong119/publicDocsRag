package com.example.backend.service;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class ResumeService {

    /**
     * PDF 파일에서 텍스트를 추출합니다.
     * 
     * @param file 업로드된 PDF 파일
     * @return 추출된 텍스트
     */
    public String extractTextFromPdf(MultipartFile file) {
        try (InputStream stream = file.getInputStream()) {
            BodyContentHandler handler = new BodyContentHandler(-1); // 용량 제한 없음
            Metadata metadata = new Metadata();
            AutoDetectParser parser = new AutoDetectParser();
            ParseContext context = new ParseContext();

            parser.parse(stream, handler, metadata, context);
            return handler.toString();
        } catch (Exception e) {
            throw new RuntimeException("이력서 PDF 파싱 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
}
