package com.E_commerce.service;

import com.E_commerce.dto.AuthResponse;
import com.E_commerce.dto.LoginRequest;
import com.E_commerce.dto.RegisterRequest;
import com.E_commerce.modal.Role;
import com.E_commerce.modal.User;
import com.E_commerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserRepo repo;
@Autowired
        JwtService jwtService;
   BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);
   @Transactional
    public ResponseEntity<Map<String,String>> saveUser(RegisterRequest request) {

        User user =  repo.findByEmail(request.getEmail()).orElse(  new User());
        if(!(user.getEmail() ==null)){
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST,"user already exist");
        }
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        String password=encoder.encode(request.getPassword());
        user.setPassword( password);
        user.setRole(Role.CUSTOMER);
        repo.save(user);
        System.out.println(user);
        return ResponseEntity.ok(Map.of("message","registration Successfully"));
    }

    public ResponseEntity<AuthResponse> verify(LoginRequest request) {


        User user = repo.findByEmail(request.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));



            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(request
                            .getEmail(), request.getPassword()));

            if (authentication.isAuthenticated()) {
                return ResponseEntity.ok(new AuthResponse(jwtService.generateToken(request.getEmail(), user.getRole().name()), findRoleById(request)));
            }

       throw  new BadCredentialsException("bad credentials");
    }
    public String findRoleById(LoginRequest request){
        User user=new User();
        try {
                user = repo.findByEmail(request.getEmail()).orElseThrow(()->new RuntimeException("User Not Found"));

        }  catch (RuntimeException e) {
            throw new RuntimeException("User Not Found ");

        }
        return user.getRole().name();
    }
}
