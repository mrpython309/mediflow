package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.dto.AdminDoctorResponse;
import com.mediflow.mediflow_backend.dto.UserStatusRequest;
import com.mediflow.mediflow_backend.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final DoctorService doctorService;

    public AdminDoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PatchMapping("/{doctorId}/status")
    public AdminDoctorResponse updateStatus(
            @PathVariable Long doctorId,
            @Valid @RequestBody UserStatusRequest request) {

        return doctorService.updateDoctorStatus(
                doctorId,
                request.active()
        );
    }

    @GetMapping
    public List<AdminDoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctorsForAdmin();
    }
}