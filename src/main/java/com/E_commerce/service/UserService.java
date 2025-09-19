package com.E_commerce.service;

import com.E_commerce.dto.ProfileResponse;
import com.E_commerce.dto.UserDto;
import com.E_commerce.modal.Role;
import com.E_commerce.modal.User;
import com.E_commerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;

import java.util.List;
import java.util.Map;

@Service
public class
UserService {
    @Autowired
    private UserRepo userRepo;

BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

public ProfileResponse getProfile(String userMail){
    User user=userRepo.findByEmail(userMail).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));
    return toResponse(user);
}
@Transactional
    public  ResponseEntity<Map<String,String>> updateUserPassword(String userMail , String  oldPass, String newPass ){

        User user= userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));

        if(!encoder.matches(oldPass,user.getPassword())){
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE,"Your Entered Wrong Password");
        }

        user.setPassword(encoder.encode(newPass));
    userRepo.save(user);


    return  ResponseEntity.ok().body(Map.of("message","Password Updated Successfully"));

    }
    @Transactional
   public ResponseEntity<ProfileResponse> changeUserName(String userMail, String NewUserName){

     User user = userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
  if(user.getUsername().equals(NewUserName)){
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"its your current username");
  }
     user.setUsername(NewUserName);
     userRepo.save(user);
        return  ResponseEntity.ok().body(toResponse(user));
   }

   public ResponseEntity<List<UserDto>> getUsers(String mail) throws AccessDeniedException {
    User user=userRepo.findByEmail(mail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found"));
    if(!user.getRole().equals(Role.ADMIN)){
        throw new AccessDeniedException("you don't have permissions to access this");
    }
       List<User> users=userRepo.findAll();
    return ResponseEntity.ok(users.stream().map(this::userToResponse).toList());
   }
public ResponseEntity<Map<String,String>> deleteUser(String mail , Long userId) throws AccessDeniedException {
    User user=userRepo.findByEmail(mail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

    if(!user.getRole().equals(Role.ADMIN)){
          throw new AccessDeniedException("you don't have permissions to access this");
    }
    userRepo.deleteById(userId);
    return ResponseEntity.ok(Map.of("message","user deleted successfully"));
}

   public ProfileResponse toResponse(User user){

       return new ProfileResponse(user.getEmail(),user.getUsername());
   }
public UserDto userToResponse(User user){
  return   new UserDto(
            user.getId(), user.getUsername(), user.getEmail(),user.getRole()
    );

}


}

