package com.E_commerce.repo;
import com.E_commerce.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
    Optional<User> findByEmail(@PathVariable(name = "Email") String Email);

    User findByUsername(@PathVariable (name="username")String username);


     }
