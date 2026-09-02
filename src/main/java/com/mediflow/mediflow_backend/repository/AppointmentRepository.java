package com.mediflow.mediflow_backend.repository;

import com.mediflow.mediflow_backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByStatus(
            Appointment.AppointmentStatus status);

    List<Appointment> findByDoctorIdAndStatus(
            Long doctorId,
            Appointment.AppointmentStatus status
    );

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            LocalDate appointmentDate,
            java.time.LocalTime appointmentTime
    );
}