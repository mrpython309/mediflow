package com.mediflow.mediflow_backend.dto;

import java.time.LocalDate;

public record DoctorResponse(
        Long id,
        Long userId,
        String fullName,
        LocalDate dateOfBirth,
        String qualification,
        String phone,
        Long specialistId,
        String specialistName,
        Boolean active
) {
}