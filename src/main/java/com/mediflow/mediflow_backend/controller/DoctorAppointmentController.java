package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.dto.AppointmentResponse;
import com.mediflow.mediflow_backend.dto.AppointmentStatusRequest;
import com.mediflow.mediflow_backend.entity.Appointment;
import com.mediflow.mediflow_backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/appointments")
public class DoctorAppointmentController {

    private final AppointmentService appointmentService;

    public DoctorAppointmentController(
            AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PatchMapping("/{appointmentId}/status")
    public AppointmentResponse updateStatus(
            @PathVariable Long appointmentId,
            @Valid @RequestBody AppointmentStatusRequest request,
            Authentication authentication) {

        return appointmentService.updateAppointmentStatus(
                appointmentId,
                authentication.getName(),
                request.status()
        );
    }

    @GetMapping
    public List<AppointmentResponse> getDoctorAppointments(
            @RequestParam(required = false)
            Appointment.AppointmentStatus status,
            Authentication authentication) {

        return appointmentService.getDoctorAppointments(
                authentication.getName(),
                status
        );
    }
}