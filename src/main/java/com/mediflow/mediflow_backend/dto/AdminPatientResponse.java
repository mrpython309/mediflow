package com.mediflow.mediflow_backend.dto;

import com.mediflow.mediflow_backend.entity.User;

public record AdminPatientResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        User.Role role,
        Boolean active
) {
}