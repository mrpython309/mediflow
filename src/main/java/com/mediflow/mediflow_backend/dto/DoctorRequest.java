package com.mediflow.mediflow_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DoctorRequest(

        @NotBlank(message = "Full name is required")
        String fullName,

        LocalDate dateOfBirth,

        @NotBlank(message = "Qualification is required")
        String qualification,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        String phone,

        @NotBlank(message = "Password is required")
        String password,

        @NotNull(message = "Specialist ID is required")
        Long specialistId
) {
}