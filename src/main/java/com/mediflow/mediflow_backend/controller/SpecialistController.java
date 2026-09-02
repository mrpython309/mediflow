package com.mediflow.mediflow_backend.controller;

import com.mediflow.mediflow_backend.entity.Specialist;
import com.mediflow.mediflow_backend.service.SpecialistService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialists")
public class SpecialistController {

    private final SpecialistService specialistService;

    public SpecialistController(SpecialistService specialistService) {
        this.specialistService = specialistService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Specialist createSpecialist(@RequestBody Specialist specialist) {
        return specialistService.createSpecialist(specialist);
    }

    @GetMapping
    public List<Specialist> getAllSpecialists() {
        return specialistService.getAllSpecialists();
    }
}
