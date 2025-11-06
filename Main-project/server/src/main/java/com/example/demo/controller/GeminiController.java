package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
public class GeminiController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient = WebClient.create("https://generativelanguage.googleapis.com");

    // ✅ Health check route
    @GetMapping("/")
    public String home() {
        return "✅ Java Spring Boot Gemini backend is running fine!";
    }

    // ✅ POST route
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, String>> handleRequest(@RequestBody Map<String, String> body) {
        String inputRequired = body.get("inputRequired");
        System.out.println("🟢 Received POST input: " + inputRequired);

        return callGemini(inputRequired)
                .map(responseText -> Map.of("response", responseText));
    }

    // ✅ Function to call Gemini API
    private Mono<String> callGemini(String input) {
        String url = String.format("/v1beta/models/gemini-2.0-flash:generateContent?key=%s", geminiApiKey);

        return webClient.post()
                .uri(url)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(Map.of(
                        "contents", List.of(
                                Map.of("role", "user", "parts", List.of(
                                        Map.of("text", input)
                                ))
                        )
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        // Extract model text
                        List<?> candidates = (List<?>) response.get("candidates");
                        if (candidates != null && !candidates.isEmpty()) {
                            Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                            Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                            List<?> parts = (List<?>) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                Map<?, ?> text = (Map<?, ?>) parts.get(0);
                                return text.get("text").toString();
                            }
                        }
                        return "No text response found!";
                    } catch (Exception e) {
                        System.out.println(e);
                        return "Error parsing Gemini response.";
                    }
                })
                .onErrorReturn("Error calling Gemini API ❌");
    }
}
