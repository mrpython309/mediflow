package com.mediflow.mediflow_backend.service;

import com.mediflow.mediflow_backend.entity.Specialist;
import com.mediflow.mediflow_backend.repository.SpecialistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialistService {

    private final SpecialistRepository specialistRepository;

    public SpecialistService(SpecialistRepository specialistRepository) {
        this.specialistRepository = specialistRepository;
    }

    public Specialist createSpecialist(Specialist specialist) {
        if (specialistRepository.existsByName(specialist.getName())) {
            throw new IllegalArgumentException("Specialist already exists");
        }

        return specialistRepository.save(specialist);
    }

    public List<Specialist> getAllSpecialists() {
        return specialistRepository.findAll();
    }
}