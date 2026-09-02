package com.mediflow.mediflow_backend.dto;

import com.mediflow.mediflow_backend.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
        Long id,
        Long patientId,
        String patientName,
        Long doctorId,
        String doctorName,
        String specialistName,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String gender,
        Integer age,
        String symptoms,
        String address,
        Appointment.AppointmentStatus status
) {
}