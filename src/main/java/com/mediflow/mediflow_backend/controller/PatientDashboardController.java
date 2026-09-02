package com.mediflow.mediflow_backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PatientDashboardController {

    @GetMapping("/api/patient/dashboard")
    public String patientDashboard(Authentication authentication) {

        return "Patient dashboard for: "
                + authentication.getName();
    }
}