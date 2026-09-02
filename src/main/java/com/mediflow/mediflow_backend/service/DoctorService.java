package com.mediflow.mediflow_backend.service;

import com.mediflow.mediflow_backend.dto.AdminDoctorResponse;
import com.mediflow.mediflow_backend.dto.DoctorRequest;
import com.mediflow.mediflow_backend.dto.DoctorResponse;
import com.mediflow.mediflow_backend.entity.Doctor;
import com.mediflow.mediflow_backend.entity.Specialist;
import com.mediflow.mediflow_backend.entity.User;
import com.mediflow.mediflow_backend.exception.ResourceNotFoundException;
import com.mediflow.mediflow_backend.repository.DoctorRepository;
import com.mediflow.mediflow_backend.repository.SpecialistRepository;
import com.mediflow.mediflow_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;
    private final SpecialistRepository specialistRepository;
    private final UserRepository userRepository;

    public DoctorService(
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            SpecialistRepository specialistRepository,
            UserRepository userRepository) {

        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.specialistRepository = specialistRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered");
        }

        Specialist specialist = specialistRepository
                .findById(request.specialistId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Specialist not found"));

        User doctorUser = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(User.Role.DOCTOR)
                .active(true)
                .build();

        User savedUser = userRepository.save(doctorUser);

        Doctor doctor = Doctor.builder()
                .user(savedUser)
                .fullName(request.fullName())
                .dateOfBirth(request.dateOfBirth())
                .qualification(request.qualification())
                .phone(request.phone())
                .specialist(specialist)
                .active(true)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);

        return toResponse(savedDoctor);
    }

    @Transactional(readOnly = true)
    public List<AdminDoctorResponse> getAllDoctorsForAdmin() {

        return doctorRepository.findAll()
                .stream()
                .map(doctor -> new AdminDoctorResponse(
                        doctor.getId(),
                        doctor.getUser().getId(),
                        doctor.getFullName(),
                        doctor.getUser().getEmail(),
                        doctor.getPhone(),
                        doctor.getDateOfBirth(),
                        doctor.getQualification(),
                        doctor.getSpecialist().getId(),
                        doctor.getSpecialist().getName(),
                        doctor.getActive()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminDoctorResponse updateDoctorStatus(
            Long doctorId,
            Boolean active) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        doctor.setActive(active);

        doctor.getUser().setActive(active);

        Doctor savedDoctor = doctorRepository.save(doctor);

        return new AdminDoctorResponse(
                savedDoctor.getId(),
                savedDoctor.getUser().getId(),
                savedDoctor.getFullName(),
                savedDoctor.getUser().getEmail(),
                savedDoctor.getPhone(),
                savedDoctor.getDateOfBirth(),
                savedDoctor.getQualification(),
                savedDoctor.getSpecialist().getId(),
                savedDoctor.getSpecialist().getName(),
                savedDoctor.getActive()
        );
    }

    private DoctorResponse toResponse(Doctor doctor) {

        return new DoctorResponse(
                doctor.getId(),
                doctor.getUser().getId(),
                doctor.getFullName(),
                doctor.getDateOfBirth(),
                doctor.getQualification(),
                doctor.getPhone(),
                doctor.getSpecialist().getId(),
                doctor.getSpecialist().getName(),
                doctor.getActive()
        );
    }
}