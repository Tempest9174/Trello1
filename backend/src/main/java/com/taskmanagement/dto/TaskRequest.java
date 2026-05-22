package com.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank String title,
        String description,
        @NotBlank String priority,
        LocalDate dueDate
) {}
