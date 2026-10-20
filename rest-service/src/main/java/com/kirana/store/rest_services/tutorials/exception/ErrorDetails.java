package com.kirana.store.rest_services.tutorials.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ErrorDetails {
    private LocalDateTime errorTime;
    private String errorMessage;
    private String details;
}
