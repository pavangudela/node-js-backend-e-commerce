package com.E_commerce.repo;

import com.E_commerce.modal.Address;
import com.E_commerce.modal.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address,Long> {
     List<Address> findByUser(User user);
    long  countByUser(User user);

   List<Address> findByUserEmail(String mail);

    Address findByUserAndIsDefaultTrue(User user);
@Modifying
@Query("UPDATE Address a SET a.isDefault=false WHERE a.user.id=:userId")
    void updateIsDefaultFalseForUserId(long userId);


    boolean existsByUserIdAndIsDefaultTrue(Long id);

    Address findTopByUserOrderByIdDesc(User user);

    Address findTopByUserAndIdNotOrderByIdDesc(User user,Long ignoreId);
}
