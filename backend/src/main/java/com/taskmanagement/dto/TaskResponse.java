package com.taskmanagement.dto;

import com.taskmanagement.entity.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String priority,
        LocalDate dueDate,
        String status,
        Integer position,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getDueDate(),
                task.getStatus(),
                task.getPosition(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
