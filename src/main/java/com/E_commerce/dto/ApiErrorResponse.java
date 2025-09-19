package com.E_commerce.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiErrorResponse {
    private int status;
    private String error;
    private String path;
    @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "yyyy-MM-dd' T 'HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp=LocalDateTime.now();
}
