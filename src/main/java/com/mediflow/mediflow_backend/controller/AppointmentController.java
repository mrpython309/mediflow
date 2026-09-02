package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.dto.AppointmentRequest;
import com.mediflow.mediflow_backend.dto.AppointmentResponse;
import com.mediflow.mediflow_backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {

        return appointmentService.bookAppointment(
                authentication.getName(),
                request
        );
    }

    @GetMapping
    public List<AppointmentResponse> getPatientAppointments(
            Authentication authentication) {

        return appointmentService.getPatientAppointments(
                authentication.getName()
        );
    }

    @PatchMapping("/{appointmentId}/cancel")
    public AppointmentResponse cancelAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication) {

        return appointmentService.cancelAppointment(
                appointmentId,
                authentication.getName()
        );
    }
}