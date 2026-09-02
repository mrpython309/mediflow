package com.mediflow.mediflow_backend.dto;

import com.mediflow.mediflow_backend.entity.Appointment;
import jakarta.validation.constraints.NotNull;

public record AppointmentStatusRequest(

        @NotNull(message = "Status is required")
        Appointment.AppointmentStatus status
) {
}