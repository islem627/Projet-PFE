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
}