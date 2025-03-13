package com.it.molou3_backend.security.controllers;


import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.CreateAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.ResponseAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.UpdateAppUserDTO;
import com.it.molou3_backend.security.dtos.AuthDTO.RequestLoginDTO;
import com.it.molou3_backend.security.dtos.AuthDTO.ResponseLoginDTO;
import com.it.molou3_backend.security.dtos.PasswordDTO.ChangePasswordDTO;
import com.it.molou3_backend.security.services.interfaces.IAppUserService;
import com.it.molou3_backend.services.interfaces.IAssociationService;
import com.it.molou3_backend.services.interfaces.IColombophileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Validated
@RestController
@RequestMapping("/api")
public class AppUserController {

    @Autowired
    private IAppUserService appUserService;
    @Autowired
    private IColombophileService colombophileService;
    @Autowired
    private IAssociationService associationService;

    @PostMapping("/public/register")
    public ResponseEntity<ResponseAppUserDTO> createAppUser(@Valid @RequestBody CreateAppUserDTO createAppUserDTO) {
        ResponseAppUserDTO appUser = appUserService.create(createAppUserDTO);
        return new ResponseEntity<>(appUser, HttpStatus.OK);
    }

    @PostMapping(value = "/public/colombophile/register", consumes = {"multipart/form-data"})
    public ResponseEntity<ResponseColombophileDTO> createColombophile(
            @Valid @RequestPart(value = "data", required = false) CreateColombophileDTO createColombophileDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) throws IOException {
        if (createColombophileDTO == null) {
            throw new IllegalArgumentException("Les données de création sont requises.");
        }

        try {
            ResponseColombophileDTO colombophile = colombophileService.create(createColombophileDTO, photoFile);
            return new ResponseEntity<>(colombophile, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Ou un message d’erreur personnalisé
        }
    }

    @PostMapping(value = "/public/association/register", consumes = {"multipart/form-data"})
    public ResponseEntity<ResponseAssociationDTO> createAssociation(
            @Valid @RequestPart(value = "data", required = false) CreateAssociationDTO createAssociationDTO,
            @RequestPart(value = "preuveLegale", required = false) MultipartFile preuveLegaleFile,
            @RequestPart(value = "logo", required = false) MultipartFile logoFile) throws IOException {
        if (createAssociationDTO == null) {
            throw new IllegalArgumentException("Les données de création sont requises.");
        }
        if (preuveLegaleFile == null || preuveLegaleFile.isEmpty()) {
            throw new IllegalArgumentException("La preuve légale est obligatoire pour créer une association.");
        }

        try {
            ResponseAssociationDTO association = associationService.create(createAssociationDTO, preuveLegaleFile, logoFile);
            return new ResponseEntity<>(association, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Ou un message d’erreur personnalisé
        }
    }

    @PostMapping("/public/login")
    public ResponseEntity<ResponseLoginDTO> createAppUser(@Valid @RequestBody RequestLoginDTO requestLoginDTO) {
        ResponseLoginDTO login = appUserService.login(requestLoginDTO);
        return new ResponseEntity<>(login, HttpStatus.OK);
    }

    @GetMapping("/public/current-user")
    public ResponseEntity<ResponseLoginDTO> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String token = authorizationHeader.substring(7); // Retire "Bearer "

            ResponseLoginDTO response = appUserService.getCurrentUser(token);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    @GetMapping("/public/users/{username}")
    public ResponseEntity<ResponseAppUserDTO> getAppUserByUsername( @PathVariable("username") String username) {
        ResponseAppUserDTO user = appUserService.getByUsername(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("public/users")
    public ResponseEntity<List<ResponseAppUserDTO>> getAllUsers() {
        List<ResponseAppUserDTO> users = appUserService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping("/public/users/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable("username") String username) {
        appUserService.deleteUser(username);
        return new ResponseEntity<>("Utilisateur est supprimé avec succès", HttpStatus.OK);
    }



    @PostMapping("/public/updatePassword")
    public ResponseEntity<Map<String, String>> updatePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        appUserService.changePassword(changePasswordDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Mot de passe changé avec succès.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

