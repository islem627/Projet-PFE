package com.example.user_service.DTO;

import com.example.user_service.entities.UserEntity;

public class UserDTO {

    private Long id;

    private String username;
    private String email;
    private  String password;
    private  String address;
    private  String phone;

    private  String photo;
    private  String firstname;
    private  String lastname;
    private  Boolean confirme=false;
    private  String role ;
    private String passwordResetToken;

    public String getPasswordResetToken() {
        return passwordResetToken;
    }

    public void setPasswordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Boolean getConfirme() {
        return confirme;
    }

    public void setConfirme(Boolean confirme) {
        this.confirme = confirme;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserDTO(Long id, String username, String email, String password, String address, String phone, String photo, String firstname, String lastname, Boolean confirme, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phone = phone;
        this.photo = photo;
        this.firstname = firstname;
        this.lastname = lastname;
        this.confirme = confirme;
        this.role = role;
    }

    public UserDTO() {
    }

    //fonction de converstion
    //visibité typeRetour NomFonction (TYpe parm1 parm1........) {}
    //Entity ==>DTO

    public UserDTO fromEntity (UserEntity userEntity)
    { UserDTO userDTO=new UserDTO();//création d'une nouvelle instance
        userDTO.setId(userEntity.getId());
        userDTO.setAddress(userEntity.getAddress());
        userDTO.setConfirme(userEntity.getConfirme());
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setFirstname(userEntity.getFirstname());
        userDTO.setLastname(userEntity.getLastname());
        userDTO.setPassword(userEntity.getPassword());
        userDTO.setPhone(userEntity.getPhone());
        userDTO.setUsername(userEntity.getUsername());
        userDTO.setPhoto(userEntity.getPhoto());
        userDTO.setRole(userEntity.getRole());
        return userDTO;

    }


    public UserEntity toEntity (UserDTO userDTO){
        UserEntity userEntity=new UserEntity();// creation dune instance vide
        userEntity.setId(userDTO.getId());
        userEntity.setAddress(userDTO.getAddress());
        userEntity.setConfirme(userDTO.getConfirme());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setLastname(userDTO.getLastname());
        userEntity.setFirstname(userDTO.getFirstname());
        userEntity.setPassword(userDTO.getPassword());
        userEntity.setPhone(userDTO.getPhone());
        userEntity.setRole(userDTO.getRole());
        userEntity.setUsername(userDTO.getUsername());
        userEntity.setPhoto(userDTO.getPhoto());
        return  userEntity ;
    }
}
