package com.taskmanagement.controller;

import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping("/lists/{id}/cards")
    public List<CardResponse> getCards(@PathVariable Long id) {
        return cardService.getCardsByListId(id);
    }
}
