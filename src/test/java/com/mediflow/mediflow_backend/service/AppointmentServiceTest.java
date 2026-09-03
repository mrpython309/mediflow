package com.mediflow.mediflow_backend.service;

import com.mediflow.mediflow_backend.exception.ResourceNotFoundException;
import com.mediflow.mediflow_backend.repository.AppointmentRepository;
import com.mediflow.mediflow_backend.repository.DoctorRepository;
import com.mediflow.mediflow_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    void getDoctorAppointments_ThrowsException_WhenDoctorNotFound() {
        String testEmail = "notfound@doctor.com";
        when(doctorRepository.findByUserEmail(testEmail)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class, 
                () -> appointmentService.getDoctorAppointments(testEmail)
        );

        assertEquals("Doctor not found", exception.getMessage());
    }
}
