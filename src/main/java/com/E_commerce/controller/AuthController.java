package com.E_commerce.controller;

import com.E_commerce.dto.AuthResponse;
import com.E_commerce.dto.LoginRequest;
import com.E_commerce.dto.RegisterRequest;
import com.E_commerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> Register(@RequestBody RegisterRequest request ){


return  authService.saveUser(request);
    }
@PostMapping("/login")
    public ResponseEntity<AuthResponse> login (@RequestBody LoginRequest request) {



   return (authService.verify(request));
    }
}
