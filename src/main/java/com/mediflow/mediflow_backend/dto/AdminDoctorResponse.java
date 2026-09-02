package com.mediflow.mediflow_backend.dto;

import java.time.LocalDate;

public record AdminDoctorResponse(
        Long id,
        Long userId,
        String fullName,
        String email,
        String phone,
        LocalDate dateOfBirth,
        String qualification,
        Long specialistId,
        String specialistName,
        Boolean active
) {
}