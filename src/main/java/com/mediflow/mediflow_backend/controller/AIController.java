package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.ai.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public String analyzeSymptoms(
            @RequestBody String symptoms) {

        return aiService.analyzeSymptoms(symptoms);
    }
}