package com.taskmanagement.service;

import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAllByOrderByPosition().stream()
                .map(TaskResponse::from)
                .toList();
    }
}
