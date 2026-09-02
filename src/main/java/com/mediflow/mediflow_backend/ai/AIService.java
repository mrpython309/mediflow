package com.mediflow.mediflow_backend.ai;

import com.mediflow.mediflow_backend.entity.Specialist;
import com.mediflow.mediflow_backend.service.SpecialistService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final RestClient restClient;
    private final String apiKey;
    private final SpecialistService specialistService;

    public AIService(
            @Value("${gemini.api.key}") String apiKey,
            SpecialistService specialistService) {

        this.apiKey = apiKey;
        this.specialistService = specialistService;

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public String analyzeSymptoms(String symptoms) {

        List<Specialist> specialists =
                specialistService.getAllSpecialists();

        String availableSpecialties =
                specialists.stream()
                        .map(Specialist::getName)
                        .filter(name -> name != null && !name.isBlank())
                        .distinct()
                        .collect(Collectors.joining(", "));

        if (availableSpecialties.isBlank()) {
            throw new IllegalArgumentException("No medical specialties are available. Please add doctors to the system first.");
        }

        String prompt = """
                You are MediFlow AI, a healthcare assistant
                inside a hospital management application.

                The patient has described these symptoms:

                %s

                The following medical specialties are currently
                available in MediFlow:

                %s

                Your task is to guide the patient toward the
                most appropriate available specialist.

                IMPORTANT RULES:

                1. Select exactly ONE specialist.
                2. The specialist MUST be copied exactly from
                   the available specialty list above.
                3. Do not create a new specialty.
                4. Do not combine multiple specialties.
                5. Do not write alternatives such as
                   "Cardiology / Emergency Medicine".
                6. Do not diagnose a disease.
                7. Keep the language simple and professional.
                8. Provide general guidance only.

                Return exactly this format:

                Suggested specialist: <one exact specialty name>
                Urgency: <brief urgency level and recommendation>
                Guidance: <simple general guidance>
                Disclaimer: MediFlow AI provides general information
                for educational purposes only and does not provide
                medical diagnoses or replace professional medical care.

                Do not add headings, bullet points, markdown,
                or additional sections.
                """.formatted(
                symptoms,
                availableSpecialties
        );

        Map<String, Object> requestBody = Map.of(
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of(
                                                "text",
                                                prompt
                                        )
                                )
                        )
                )
        );

        try {

            Map<?, ?> response = restClient.post()
                    .uri(
                            "/v1beta/models/gemini-1.5-flash:generateContent"
                    )
                    .header(
                            "x-goog-api-key",
                            apiKey
                    )
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            return extractText(response);

        } catch (Exception e) {

            e.printStackTrace();

            throw new IllegalArgumentException("AI ERROR: " + e.getMessage());
        }
    }

    private String extractText(Map<?, ?> response) {

        if (response == null) {
            throw new IllegalArgumentException("Unable to generate an AI response.");
        }

        Object candidates =
                response.get("candidates");

        if (!(candidates instanceof List<?> candidateList)
                || candidateList.isEmpty()) {

            throw new IllegalArgumentException("Unable to generate an AI response.");
        }

        Object firstCandidate =
                candidateList.get(0);

        if (!(firstCandidate instanceof Map<?, ?> candidateMap)) {
            throw new IllegalArgumentException("Unable to generate an AI response.");
        }

        Object content =
                candidateMap.get("content");

        if (!(content instanceof Map<?, ?> contentMap)) {
            throw new IllegalArgumentException("Unable to generate an AI response.");
        }

        Object parts =
                contentMap.get("parts");

        if (!(parts instanceof List<?> partList)
                || partList.isEmpty()) {

            throw new IllegalArgumentException("Unable to generate an AI response.");
        }

        Object firstPart =
                partList.get(0);

        if (!(firstPart instanceof Map<?, ?> partMap)) {
            throw new IllegalArgumentException("Unable to generate an AI response.");
        }

        Object text =
                partMap.get("text");

        if (text instanceof String textValue) {
            return textValue.trim();
        }

        throw new IllegalArgumentException("Unable to generate an AI response.");
    }
}