package com.mediflow.mediflow_backend.repository;

import com.mediflow.mediflow_backend.entity.Specialist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecialistRepository extends JpaRepository<Specialist, Long> {

    boolean existsByName(String name);
}