package com.E_commerce.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Service
public class JwtService {


    public SecretKey getKey(){
      String  secretKey="u8hM9iL5qN1zF4X7wA2kB6sD9rT3vP0xY7Z5W3H8Q1L6C9M2N4J0V8K1T5R2O7U9";
      return Keys.hmacShaKeyFor(secretKey.getBytes());

    }
    public String generateToken(String userMail, String role){
        Map<String,Object> claims=new HashMap<>();
        claims.put("role",role);
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(userMail)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ 1000*60*60*100))
                .and()
                .signWith(getKey())
                .compact();

    }
    public String extractUserMail(String token){
      return   Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    public String  extractRole(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role",String.class);
    }
    public boolean isTokenExpired(String token ){
      Date  expiration=  Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
      return expiration.before(new Date(System.currentTimeMillis()));
    }

    public boolean isTokenValid(String  userMail ,String token ){
        String extractedUserMail=extractUserMail(token);
//        System.out.println("Extracted: " + extractedUsername);
//        System.out.println("Username param: " + username);
//        System.out.println("Expired? " + isTokenExpired(token));
        return(extractedUserMail.equals(userMail) && !isTokenExpired(token));
    }

}
