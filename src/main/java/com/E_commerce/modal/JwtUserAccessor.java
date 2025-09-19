package com.E_commerce.modal;

import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Component
@Data
public class JwtUserAccessor {

    public String getMail(){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        if(auth==null ||!auth.isAuthenticated()){
            throw  new IllegalArgumentException("No Authenticated User Found");
        }
      return   auth.getName();
    }

    public String role(){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
       return auth.getAuthorities()
               .stream()
               .findFirst()
               .map(Object::toString)
               .orElse(null);
    }
}
