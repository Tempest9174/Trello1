package com.taskmanagement.controller;

import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getTasks() {
        return taskService.getAllTasks();
    }
}
