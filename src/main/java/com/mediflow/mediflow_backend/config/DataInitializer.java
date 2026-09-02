package com.mediflow.mediflow_backend.config;

import com.mediflow.mediflow_backend.entity.User;
import com.mediflow.mediflow_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String email = "admin@mediflow.com";

            if (!userRepository.existsByEmail(email)) {

                User admin = User.builder()
                        .fullName("MediFlow Admin")
                        .email(email)
                        .password(passwordEncoder.encode("Admin@123"))
                        .phone("9999999999")
                        .role(User.Role.ADMIN)
                        .active(true)
                        .build();

                userRepository.save(admin);

                System.out.println(
                        "Default admin created: " + email
                );
            }
        };
    }
}