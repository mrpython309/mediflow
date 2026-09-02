package com.mediflow.mediflow_backend.dto;

import com.mediflow.mediflow_backend.entity.User;

public record LoginResponse(
        String token,
        Long userId,
        String fullName,
        String email,
        User.Role role
) {
}