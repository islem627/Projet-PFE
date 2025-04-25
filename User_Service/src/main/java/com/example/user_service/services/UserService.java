package com.example.user_service.services;

import com.example.user_service.DTO.UserDTO;
import com.example.user_service.entities.UserEntity;
import com.example.user_service.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    public UserEntity create(UserEntity userEntity) {
        return userRepo.save(userEntity);
    }

   public UserEntity update(UserEntity userEntity) {
        return userRepo.save(userEntity);
    }

    public UserEntity oneUser(Long id) {
        return userRepo.findById(id).orElse(null);
    }

    public List<UserEntity> GetAll() {
        return userRepo.findAll();
    }

    public void Delete(Long id) {
        userRepo.deleteById(id);
    }

    public UserEntity getUserById (Long id) {

        return userRepo.findById(id).orElse(null);

    }



//    public void sendPasswordResetToken(String email) {
//        UserEntity user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
//
//        String token = UUID.randomUUID().toString();
//        user.setPasswordResetToken(token);
//        userRepo.save(user);
//
//        String resetLink = "http://localhost:4200/reset-password?token=" + token;
//        mailService.sendSimpleMessage(
//                email,
//                "Réinitialisation du mot de passe",
//                "Cliquez sur le lien suivant pour réinitialiser votre mot de passe :\n" + resetLink
//        );
//    }
//
//    public void resetPassword(String token, String newPassword) {
//        UserEntity user = userRepo.findByPasswordResetToken(token)
//                .orElseThrow(() -> new RuntimeException("Token invalide ou expiré"));
//
//        user.setPassword(passwordEncoder.encode(newPassword));
//        user.setPasswordResetToken(null); // on vide le token après utilisation
//        userRepo.save(user);
//    }




}
