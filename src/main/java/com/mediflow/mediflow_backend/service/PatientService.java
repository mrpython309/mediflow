package com.mediflow.mediflow_backend.service;

import com.mediflow.mediflow_backend.dto.AdminPatientResponse;
import com.mediflow.mediflow_backend.dto.PatientRegistrationRequest;
import com.mediflow.mediflow_backend.dto.PatientResponse;
import com.mediflow.mediflow_backend.entity.User;
import org.springframework.transaction.annotation.Transactional;
import com.mediflow.mediflow_backend.exception.ResourceNotFoundException;
import com.mediflow.mediflow_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdminPatientResponse> getAllPatients() {

        return userRepository.findByRole(User.Role.PATIENT)
                .stream()
                .map(user -> new AdminPatientResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.getActive()
                ))
                .toList();
    }

    @Transactional
    public AdminPatientResponse updatePatientStatus(
            Long patientId,
            Boolean active) {

        User patient = userRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException(
                    "User is not a patient");
        }

        patient.setActive(active);

        User savedPatient = userRepository.save(patient);

        return new AdminPatientResponse(
                savedPatient.getId(),
                savedPatient.getFullName(),
                savedPatient.getEmail(),
                savedPatient.getPhone(),
                savedPatient.getRole(),
                savedPatient.getActive()
        );
    }

    public PatientResponse register(PatientRegistrationRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User patient = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(User.Role.PATIENT)
                .active(true)
                .build();

        User savedPatient = userRepository.save(patient);

        return new PatientResponse(
                savedPatient.getId(),
                savedPatient.getFullName(),
                savedPatient.getEmail(),
                savedPatient.getPhone(),
                savedPatient.getRole(),
                savedPatient.getActive()
        );
    }
}