package com.E_commerce.exception;
import com.E_commerce.dto.ApiErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

   @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse>handleResponseStatusException(ResponseStatusException ex , HttpServletRequest request){
       ApiErrorResponse error=ApiErrorResponse.builder()
               .status(ex.getStatusCode().value())
               .error(ex.getReason())
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(ex.getStatusCode()).body(error);
   }
   @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex ,HttpServletRequest request){
       ApiErrorResponse error= ApiErrorResponse.builder()
               .status(HttpStatus.BAD_REQUEST.value())
               .error(ex.getMessage())
               .path(String.valueOf(request.getRequestURL())).build();
       return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);

   }
   @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentialsException(BadCredentialsException ex ,HttpServletRequest request){
       ApiErrorResponse error=ApiErrorResponse.builder()
               .status(HttpStatus.UNAUTHORIZED.value())
               .error("Invalid email or password ")
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
   }
   @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException ex ,HttpServletRequest request){
       ApiErrorResponse error=ApiErrorResponse.builder()
               .status(HttpStatus.FORBIDDEN.value())
               .error("Access denied. Insufficient permissions")
               .path(String.valueOf(request.getRequestURL()))
               .build();
return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
      }

@ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse>handleException(Exception ex,HttpServletRequest request){
       ApiErrorResponse error =ApiErrorResponse.builder()
               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
               .error(ex.getMessage())
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
}
@ExceptionHandler(NoResourceFoundException.class)
public ResponseEntity<ApiErrorResponse> handleNoResourceFoundException(NoResourceFoundException ex,HttpServletRequest request){
       ApiErrorResponse error=ApiErrorResponse.builder()
               .status(HttpStatus.NOT_FOUND.value())
               .error("not found ")
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
}
@ExceptionHandler(CartEmptyException.class)
    public ResponseEntity<ApiErrorResponse> handleCartEmptyException(CartEmptyException ex, HttpServletRequest request){
       ApiErrorResponse error=ApiErrorResponse.builder()
               .status(HttpStatus.BAD_REQUEST.value())
               .error(ex.getMessage())
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
   }
   @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiErrorResponse> handleExpiredJwtException(ExpiredJwtException ex, HttpServletRequest request){
       ApiErrorResponse error=ApiErrorResponse.builder()
               .status(HttpStatus.UNAUTHORIZED.value())
               .error(ex.getMessage())
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
   }
   @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorResponse> handleJwtException(JwtException  ex, HttpServletRequest request){
       ApiErrorResponse error =ApiErrorResponse.builder()
               .status(HttpStatus.UNAUTHORIZED.value())
               .error(ex.getMessage())
               .path(String.valueOf(request.getRequestURL()))
               .build();
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
   }
}
