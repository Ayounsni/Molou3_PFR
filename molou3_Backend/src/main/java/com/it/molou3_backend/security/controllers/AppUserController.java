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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @PostMapping("/public/colombophile/register")
    public ResponseEntity<ResponseColombophileDTO> createColombophile(@Valid @RequestBody CreateColombophileDTO createColombophileDTO) {
        ResponseColombophileDTO colombophile = colombophileService.create(createColombophileDTO);
        return new ResponseEntity<>(colombophile, HttpStatus.OK);
    }

    @PostMapping("/public/association/register")
    public ResponseEntity<ResponseAssociationDTO> createAssociation(@Valid @RequestBody CreateAssociationDTO createAssociationDTO) {
        ResponseAssociationDTO association = associationService.create(createAssociationDTO);
        return new ResponseEntity<>(association, HttpStatus.OK);
    }

    @PostMapping("/public/login")
    public ResponseEntity<ResponseLoginDTO> createAppUser(@Valid @RequestBody RequestLoginDTO requestLoginDTO) {
        ResponseLoginDTO login = appUserService.login(requestLoginDTO);
        return new ResponseEntity<>(login, HttpStatus.OK);
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



    @PostMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        appUserService.changePassword(changePasswordDTO);
        return new ResponseEntity<>("Mot de passe changé avec succès.", HttpStatus.OK);
    }
}

