package com.taskmanagement.service;

import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public List<CardResponse> getCardsByListId(Long listId) {
        return cardRepository.findByListIdOrderByPosition(listId).stream()
                .map(CardResponse::from)
                .toList();
    }
}
