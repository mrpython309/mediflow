package com.mediflow.mediflow_backend.service;

import com.mediflow.mediflow_backend.dto.AppointmentRequest;
import com.mediflow.mediflow_backend.dto.AppointmentResponse;
import com.mediflow.mediflow_backend.entity.Appointment;
import com.mediflow.mediflow_backend.entity.Doctor;
import com.mediflow.mediflow_backend.entity.User;
import com.mediflow.mediflow_backend.exception.ResourceNotFoundException;
import com.mediflow.mediflow_backend.repository.AppointmentRepository;
import com.mediflow.mediflow_backend.repository.DoctorRepository;
import com.mediflow.mediflow_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    // =========================
    // PATIENT - BOOK APPOINTMENT
    // =========================

    @Transactional
    public AppointmentResponse bookAppointment(
            String patientEmail,
            AppointmentRequest request) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException(
                    "Only patients can book appointments");
        }

        Doctor doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (!Boolean.TRUE.equals(doctor.getActive())) {
            throw new IllegalArgumentException(
                    "Selected doctor is not active");
        }

        boolean alreadyBooked =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                                doctor.getId(),
                                request.appointmentDate(),
                                request.appointmentTime()
                        );

        if (alreadyBooked) {
            throw new IllegalArgumentException(
                    "Doctor is already booked for this time");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.appointmentDate())
                .appointmentTime(request.appointmentTime())
                .gender(request.gender())
                .age(request.age())
                .symptoms(request.symptoms())
                .address(request.address())
                .status(Appointment.AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        return toResponse(saved);
    }

    // =========================
    // DOCTOR - GET APPOINTMENTS
    // =========================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorAppointments(
            String doctorEmail,
            Appointment.AppointmentStatus status) {

        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        List<Appointment> appointments;

        if (status == null) {
            appointments = appointmentRepository
                    .findByDoctorId(doctor.getId());
        } else {
            appointments = appointmentRepository
                    .findByDoctorIdAndStatus(
                            doctor.getId(),
                            status
                    );
        }

        return appointments.stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // PATIENT - GET APPOINTMENTS
    // =========================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientAppointments(
            String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return appointmentRepository
                .findByPatientId(patient.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // ADMIN - GET ALL APPOINTMENTS
    // =========================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // DOCTOR - GET ALL
    // =========================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorAppointments(
            String doctorEmail) {

        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        return appointmentRepository
                .findByDoctorId(doctor.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // DOCTOR - UPDATE STATUS
    // =========================

    @Transactional
    public AppointmentResponse updateAppointmentStatus(
            Long appointmentId,
            String doctorEmail,
            Appointment.AppointmentStatus newStatus) {

        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found"));

        // Object-level authorization
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to modify this appointment");
        }

        Appointment.AppointmentStatus currentStatus =
                appointment.getStatus();

        validateDoctorStatusTransition(currentStatus, newStatus);

        appointment.setStatus(newStatus);

        Appointment saved = appointmentRepository.save(appointment);

        return toResponse(saved);
    }

    // =========================
    // STATUS TRANSITIONS
    // =========================

    private void validateDoctorStatusTransition(
            Appointment.AppointmentStatus currentStatus,
            Appointment.AppointmentStatus newStatus) {

        if (currentStatus == Appointment.AppointmentStatus.PENDING) {

            if (newStatus == Appointment.AppointmentStatus.APPROVED
                    || newStatus == Appointment.AppointmentStatus.REJECTED) {

                return;
            }
        }

        if (currentStatus == Appointment.AppointmentStatus.APPROVED
                && newStatus == Appointment.AppointmentStatus.COMPLETED) {

            return;
        }

        throw new IllegalArgumentException(
                "Invalid doctor status transition from "
                        + currentStatus
                        + " to "
                        + newStatus
        );
    }

    // =========================
    // PATIENT - CANCEL
    // =========================

    @Transactional
    public AppointmentResponse cancelAppointment(
            Long appointmentId,
            String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found"));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to cancel this appointment");
        }

        Appointment.AppointmentStatus currentStatus =
                appointment.getStatus();

        if (currentStatus != Appointment.AppointmentStatus.PENDING
                && currentStatus != Appointment.AppointmentStatus.APPROVED) {

            throw new IllegalArgumentException(
                    "Appointment cannot be cancelled in status "
                            + currentStatus);
        }

        appointment.setStatus(
                Appointment.AppointmentStatus.CANCELLED);

        Appointment saved = appointmentRepository.save(appointment);

        return toResponse(saved);
    }

    // =========================
    // ENTITY → RESPONSE DTO
    // =========================

    private AppointmentResponse toResponse(
            Appointment appointment) {

        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getFullName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getFullName(),
                appointment.getDoctor()
                        .getSpecialist()
                        .getName(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getGender(),
                appointment.getAge(),
                appointment.getSymptoms(),
                appointment.getAddress(),
                appointment.getStatus()
        );
    }
}