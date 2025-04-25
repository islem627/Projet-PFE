package com.example.user_service.repositories;


import com.example.user_service.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity,Long> {
    UserEntity findFirstByEmail(String email);
   // List<User> findAllByRole(Role role);

    Optional<UserEntity> findByUsername(String username);
    //Optional<UserModel> findByIdAndAdress(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
    UserEntity findByPasswordResetToken(String passwordResetToken);
    Optional<UserEntity> findByEmail(String email);





}
