package com.E_commerce.controller;

import com.E_commerce.dto.ProfileResponse;
import com.E_commerce.dto.UpdatePasswordRequest;
import com.E_commerce.dto.UserDto;
import com.E_commerce.modal.JwtUserAccessor;
import com.E_commerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
@Autowired
UserService userService;
@Autowired
JwtUserAccessor jwtUser;
@GetMapping
public ProfileResponse getProfile(){
return    userService.getProfile(jwtUser.getMail());
}
@PostMapping("/change-password")
public ResponseEntity<Map<String, String>>  changeUserPassword(@RequestBody  UpdatePasswordRequest request){
    System.out.println(request);
    return userService.updateUserPassword(jwtUser.getMail(), request.getOldPassword(), request.getNewPassword());
}

@PostMapping("/change-user-name/{userName}")
    public ResponseEntity<ProfileResponse >changeUserName(@PathVariable String userName){
    return userService.changeUserName(jwtUser.getMail(), userName);
}
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/all-users")
public ResponseEntity<List<UserDto>> getUsers() throws AccessDeniedException {
    return userService.getUsers(jwtUser.getMail());
}

@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/admin/delete-user/{id}")
public ResponseEntity<Map<String,String>> deleteUser(@PathVariable Long id) throws AccessDeniedException {
    return userService.deleteUser(jwtUser.getMail(), id);
}






}
