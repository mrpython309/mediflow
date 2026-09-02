package com.mediflow.mediflow_backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorDashboardController {

    @GetMapping("/api/doctor/dashboard")
    public String doctorDashboard(Authentication authentication) {

        return "Doctor dashboard for: "
                + authentication.getName();
    }
}