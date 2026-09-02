package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.dto.PatientRegistrationRequest;
import com.mediflow.mediflow_backend.dto.PatientResponse;
import com.mediflow.mediflow_backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/dashboard")
    public String patientDashboard(Authentication authentication) {

        return "Patient dashboard for: "
                + authentication.getName();
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse register(
            @Valid @RequestBody PatientRegistrationRequest request) {

        return patientService.register(request);
    }
}