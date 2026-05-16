package com.taskmanagement.dto;

import com.taskmanagement.entity.Card;

import java.time.LocalDate;

public record CardResponse(
        Long id,
        Long listId,
        String title,
        String description,
        LocalDate dueDate,
        String priority,
        Integer position
) {
    public static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getListId(),
                card.getTitle(),
                card.getDescription(),
                card.getDueDate(),
                card.getPriority(),
                card.getPosition()
        );
    }
}
