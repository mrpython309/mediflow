package com.mediflow.mediflow_backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminDashboardController {

    @GetMapping("/api/admin/dashboard")
    public String adminDashboard(Authentication authentication) {

        return "Admin dashboard for: "
                + authentication.getName();
    }
}