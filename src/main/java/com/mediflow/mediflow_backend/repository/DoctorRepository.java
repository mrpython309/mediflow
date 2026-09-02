package com.mediflow.mediflow_backend.repository;

import com.mediflow.mediflow_backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUserEmail(String email);

    List<Doctor> findBySpecialistId(Long specialistId);
}