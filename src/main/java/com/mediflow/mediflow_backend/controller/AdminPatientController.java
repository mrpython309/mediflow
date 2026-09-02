package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.dto.AdminPatientResponse;
import com.mediflow.mediflow_backend.dto.UserStatusRequest;
import com.mediflow.mediflow_backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/patients")
public class AdminPatientController {

    private final PatientService patientService;

    public AdminPatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PatchMapping("/{patientId}/status")
    public AdminPatientResponse updateStatus(
            @PathVariable Long patientId,
            @Valid @RequestBody UserStatusRequest request) {

        return patientService.updatePatientStatus(
                patientId,
                request.active()
        );
    }

    @GetMapping
    public List<AdminPatientResponse> getAllPatients() {
        return patientService.getAllPatients();
    }
}