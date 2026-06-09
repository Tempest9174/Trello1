package com.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        @NotBlank @Pattern(regexp = "HIGH|MEDIUM|LOW", message = "priority は HIGH / MEDIUM / LOW のいずれかを指定してください")
        String priority,
        LocalDate dueDate
) {}
