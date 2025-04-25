package com.example.user_service.controllers;

import com.example.user_service.DTO.UserDTO;
import com.example.user_service.JWT.JwtUtils;
import com.example.user_service.entities.RefreshToken;
import com.example.user_service.entities.UserEntity;
import com.example.user_service.payload.JwtResponse;
import com.example.user_service.payload.LoginRequest;
import com.example.user_service.payload.MessageResponse;
import com.example.user_service.repositories.UserRepo;
import com.example.user_service.services.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/User")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    StorageService storageService;
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    UserRepo userRepo;

    @Autowired
    PasswordEncoder encoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;
    //
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
//

    @PostMapping("/create")
    public UserDTO addUser(@RequestBody UserDTO userDTO) {
        UserEntity userEntity = userDTO.toEntity(userDTO);
        UserEntity savedUser = userService.create(userEntity);
        return userDTO.fromEntity(savedUser);
    }

    @PostMapping("/createPhoto")
    public UserDTO addUserPhoto(UserEntity user, @RequestParam("file") MultipartFile file) throws MessagingException {


        String photoPath = storageService.store(file);


        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(encoder.encode(user.getPassword()));
        userDTO.setAddress(user.getAddress());
        userDTO.setPhone(user.getPhone());
        userDTO.setFirstname(user.getFirstname());
        userDTO.setLastname(user.getLastname());

        userDTO.setRole(user.getRole());
        userDTO.setPhoto(photoPath);


        UserEntity userEntity = userDTO.toEntity(userDTO);
        UserEntity savedUser = userService.create(userEntity);

//envoi mail apres creation


        String to = savedUser.getEmail();
        String from = "adminrh@gmail.com";
        String subject = "creation compte";
        String content = "lettre";
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom(from);
        messageHelper.setTo(to);
        messageHelper.setSubject(subject);
        messageHelper.setText("<html><body>" + content + " <br><a href = http://localhost:8762/User/confirm?email=" + savedUser.getEmail() + "> verify</br></body></html>", true);
        javaMailSender.send(message);

        return userDTO.fromEntity(savedUser);
    }

    @GetMapping("/getall")
    public List<UserDTO> getAll() {
        return userService.GetAll().stream()
                .map(userEntity -> new UserDTO().fromEntity(userEntity))
                .collect(Collectors.toList());
    }

    @GetMapping("/getuser/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        UserEntity userEntity = userService.oneUser(id);
        return new UserDTO().fromEntity(userEntity);
    }

    @PutMapping("/update/{id}")
    public UserEntity update(@PathVariable Long id,  UserEntity userEntity,@RequestParam("file") MultipartFile file) {
        //update picture
        String photoPath = storageService.store(file);
        userEntity.setPhoto(photoPath);


        UserEntity oldUser = userService.oneUser(id);
        userEntity.setId(id);
        userEntity.setPassword(encoder.encode(userEntity.getPassword()));

userEntity.setConfirme(oldUser.getConfirme());

        if (userEntity.getUsername() == null) userEntity.setUsername(oldUser.getUsername());
        if (userEntity.getConfirme() == null) userEntity.setConfirme(oldUser.getConfirme());
        if (userEntity.getAddress() == null) userEntity.setAddress(oldUser.getAddress());
        if (userEntity.getEmail() == null) userEntity.setEmail(oldUser.getEmail());
        if (userEntity.getLastname() == null) userEntity.setLastname(oldUser.getLastname());
        if (userEntity.getPassword() == null) userEntity.setPassword(oldUser.getPassword());
        if (userEntity.getPhone() == null) userEntity.setPhone(oldUser.getPhone());
        if (userEntity.getRole() == null) userEntity.setRole(oldUser.getRole());
        if (userEntity.getFirstname() == null) userEntity.setFirstname(oldUser.getFirstname());

       return  userService.update(userEntity);

    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Long id) {
        userService.Delete(id);
    }


    @GetMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam String email) {

        UserEntity user = userRepo.findFirstByEmail(email);
        user.setConfirme(true);
        userRepo.save(user);
        return ResponseEntity.ok("is confim");
    }


    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestParam("username") String username,
                                              @RequestParam("password") String password) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(username, password));

        Optional<UserEntity> u = userRepo.findByUsername(username);
        if (u.isPresent() && u.get().getConfirme()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails);
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    "Bearer ",
                    refreshToken.getToken(),
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles.get(0)
            ));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Utilisateur non confirmé");
        }
    }

    @GetMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();
        refreshTokenService.deleteByUserId(userId);
        return ResponseEntity.ok(new MessageResponse("Log out successful"));
    }

/*
@PostMapping("/register")
public ResponseEntity<?> registerUser(@RequestParam("username") String username,
                                      @RequestParam("email") String email,
                                      @RequestParam("password") String password,
                                      @RequestParam("address") String address,
                                      @RequestParam("phone") String phone,
                                      @RequestParam("firstname") String firstname,
                                      @RequestParam("lastname") String lastname,
                                      @RequestParam("role") String role,
                                      @RequestParam ("gouvernorat") String gouvernorat,
                                      @RequestParam(value = "photo", required = false) MultipartFile file) throws IOException, MessagingException {

    // Vérifier si un utilisateur existe déjà avec cet email ou username
    if (userRepo.findByUsername(username).isPresent()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Erreur: Le nom d'utilisateur est déjà pris."));
    }

    if (userRepo.findByEmail(email).isPresent()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Erreur: L'email est déjà utilisé."));
    }

    // Création de l'objet utilisateur
    UserEntity user = new UserEntity();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(encoder.encode(password));
    user.setAddress(address);
    user.setPhone(phone);
    user.setFirstname(firstname);
    user.setLastname(lastname);
    user.setRole(role);
    user.setGouvernorat(gouvernorat);
    user.setConfirme(false);

    // Gestion de la photo : convertir en base64
    if (file != null && !file.isEmpty()) {
        byte[] bytes = file.getBytes();
        String encodedPhoto = Base64.getEncoder().encodeToString(bytes);
        user.setPhoto(encodedPhoto);
    }

    // Sauvegarde
    UserEntity savedUser = userService.create(user);

    // Envoi d'email de confirmation
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);
    messageHelper.setFrom("adminrh@gmail.com");
    messageHelper.setTo(savedUser.getEmail());
    messageHelper.setSubject("Création de compte");
    messageHelper.setText("<html><body>Votre compte a été créé avec succès. "
            + "Cliquez sur le lien pour confirmer votre inscription : "
            + "<a href='http://localhost:8762/User/confirm?email=" + savedUser.getEmail() + "'>Confirmer</a>"
            + "</body></html>", true);

    javaMailSender.send(message);

    Map<String, Object> response = new HashMap<>();
    response.put("status", "success");
    response.put("message", "Utilisateur enregistré avec succès");
    response.put("user", savedUser);

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}

*/







    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestParam("username") String username,
                                          @RequestParam("email") String email,
                                          @RequestParam("password") String password,
                                          @RequestParam("address") String address,
                                          @RequestParam("phone") String phone,
                                          @RequestParam("firstname") String firstname,
                                          @RequestParam("lastname") String lastname,
                                          @RequestParam("role") String role,
                                          @RequestParam("gouvernorat") String gouvernorat,
                                          @RequestParam("file") MultipartFile file) throws IOException, MessagingException {
        String photoPath = storageService.store(file);

        if (userRepo.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur: Le nom d'utilisateur est déjà pris."));
        }

        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur: L'email est déjà utilisé."));
        }

        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setAddress(address);
        user.setPhone(phone);
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setRole(role);
        user.setGouvernorat(gouvernorat);
        user.setConfirme(false);
        user.setPhoto(photoPath);


        // 👉 Utiliser le chemin du fichier plutôt que base64
        if (file != null && !file.isEmpty()) {
            user.setPhoto(photoPath);
        }

        UserEntity savedUser = userService.create(user);

        // Email confirmation
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);
        messageHelper.setFrom("adminrh@gmail.com");
        messageHelper.setTo(savedUser.getEmail());
        messageHelper.setSubject("Création de compte");
        messageHelper.setText("<html><body>Votre compte a été créé avec succès. "
                + "Cliquez sur le lien pour confirmer votre inscription : "
                + "<a href='http://localhost:8762/User/confirm?email=" + savedUser.getEmail() + "'>Confirmer</a>"
                + "</body></html>", true);
        javaMailSender.send(message);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Utilisateur enregistré avec succès");
        response.put("user", savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }











    @GetMapping("/findByEmail")
    public ResponseEntity<?> findByEmail(@RequestParam String email) {
        Optional<UserEntity> userOptional = userRepo.findByEmail(email);

        if (userOptional.isPresent()) {
            // Utilisateur trouvé
            UserEntity user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            // Utilisateur non trouvé
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.loadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }


//    @PostMapping("/forgot-password")
//    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
//        userService.sendPasswordResetToken(email);
//        return ResponseEntity.ok("Un lien de réinitialisation a été envoyé à votre email.");
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
//        userService.resetPassword(request.getToken(), request.getNewPassword());
//        return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
//    }

    @PostMapping("/resetpassword")
    public ResponseEntity resetPassword(String email) throws MessagingException {

        UserEntity existuser = userRepo.findFirstByEmail(email);
        System.out.println("************************user*****************" + existuser);

        int code = (int)(Math.random()) + 10000;
        //existuser.setPasswordResetToken(code.toString());
        existuser.setId(existuser.getId());
        String from = "admin@gmail.com";
        String to = email;
        String subject = "confirm creation";
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);

        messageHelper.setSubject(subject);
        messageHelper.setTo(to);
        messageHelper.setFrom(from);
        messageHelper.setText("<html><body> <p> your new password is :  "+code+" <br> </br></body></html>",true);
javaMailSender.send(message);
existuser.setPassword(encoder.encode(String.valueOf(code)));
userRepo.save(existuser);
        return ResponseEntity.ok(new MessageResponse("Password reset please check your email!"));



    }




}




