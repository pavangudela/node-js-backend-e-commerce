package com.E_commerce.service;
import com.E_commerce.modal.MyuserDetails;
import com.E_commerce.modal.User;
import com.E_commerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MyuserDetailsService implements UserDetailsService {
    @Autowired
     private UserRepo repo;
    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {

        User user=repo.findByEmail(loginId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if(user==null) user = (repo.findByUsername(loginId));
        if(user==null){
            throw new UsernameNotFoundException("User Not Found ");

        }
        return new MyuserDetails(user);
    }
}
