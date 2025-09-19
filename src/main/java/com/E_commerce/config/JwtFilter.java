package com.E_commerce.config;

import com.E_commerce.modal.MyuserDetails;
import com.E_commerce.modal.User;
import com.E_commerce.repo.UserRepo;
import com.E_commerce.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
 

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
 private UserRepo repo;
    @Override
    protected void doFilterInternal(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        String path=request.getServletPath();

        if("/api/auth/login".equals(path) ||"/api/auth/register".equals(path) ||"/api/products".equals(path) ){
            filterChain.doFilter(request,response);
            return;
        }
         String AuthHeader=request.getHeader("Authorization");
         System.out.println(AuthHeader);
         try {
             if (AuthHeader == null || !AuthHeader.startsWith("Bearer ")) {
                 throw new JwtException("Invalid Token");

             }

             String token = AuthHeader.substring(7);
             String userMail = jwtService.extractUserMail(token);
             String role = jwtService.extractRole(token);
//        System.out.println(userMail  +"token:"+token);
             if (userMail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                 if (jwtService.isTokenValid(userMail, token)) {

                     User user = repo.findByEmail(userMail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));

                     MyuserDetails userDetails = new MyuserDetails(user);
                     System.out.println("Authorities from token: " + userDetails.getAuthorities());

                     UsernamePasswordAuthenticationToken authToken =
                             new UsernamePasswordAuthenticationToken(userDetails,
                                     null,
                                     userDetails.getAuthorities());
                     SecurityContextHolder
                             .getContext().setAuthentication(authToken);

                 }
             }
             filterChain.doFilter(request, response);

         }  catch (io.jsonwebtoken.ExpiredJwtException ex ){

             response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Token expired\" }");

        }
         catch (io.jsonwebtoken.JwtException ex){

             response.setContentType("application/json");
             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
             response.getWriter().write("{\"error\":\"Token Invalid\" }");

         }
    }
}
