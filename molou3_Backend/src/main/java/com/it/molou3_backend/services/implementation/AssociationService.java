package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;
import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.mappers.AssociationMapper;
import com.it.molou3_backend.repository.AssociationRepository;
import com.it.molou3_backend.security.config.Jwt.JwtUtils;
import com.it.molou3_backend.security.dtos.AppUserDTO.CreateAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.ResponseAppUserDTO;
import com.it.molou3_backend.security.entities.AppUser;
import com.it.molou3_backend.security.mappers.AppUserMapper;
import com.it.molou3_backend.security.repositories.AppRoleRepository;
import com.it.molou3_backend.security.repositories.AppUserRepository;
import com.it.molou3_backend.security.services.implementations.HaveIBeenPwnedService;
import com.it.molou3_backend.services.interfaces.IAssociationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AssociationService extends GenericService<Association,CreateAssociationDTO,UpdateAssociationDTO,ResponseAssociationDTO> implements IAssociationService {

    public AssociationService(AssociationRepository associationRepository, AssociationMapper associationMapper) {
        super(associationRepository, associationMapper);
    }
    @Autowired
    public  AssociationRepository associationRepository;
    @Autowired
    public  AssociationMapper associationMapper;
    @Autowired
    public  PasswordEncoder passwordEncoder;
    @Autowired
    public  HaveIBeenPwnedService haveIBeenPwnedService;
    @Autowired
    public FileUploadService fileUploadService;


    @Override
    public ResponseAssociationDTO create(CreateAssociationDTO createAssociationDTO, MultipartFile preuveLegaleFile, MultipartFile logoFile) throws IOException {
        if (associationRepository.findByEmail(createAssociationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cette email existe déjà.");
        }
        if (haveIBeenPwnedService.isPasswordPwned(createAssociationDTO.getPassword())) {
            throw new IllegalArgumentException("Le mot de passe est compromis. Veuillez en choisir un autre.");
        }
        Association user = associationMapper.toEntity(createAssociationDTO);
        user.setPassword(passwordEncoder.encode(createAssociationDTO.getPassword()));

        // Upload et stockage de la preuve légale
        if (preuveLegaleFile != null && !preuveLegaleFile.isEmpty()) {
            String preuveLegaleUrl = fileUploadService.uploadFile(preuveLegaleFile); // URL générée
            user.setPreuveLegalePath(preuveLegaleUrl); // Assignée à l’entité
        } else {
            throw new IllegalArgumentException("La preuve légale est obligatoire pour une association.");
        }

        // Upload et stockage du logo
        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = fileUploadService.uploadFile(logoFile); // URL générée
            user.setPhotoUrl(logoUrl); // Assignée à photoUrl de AppUser
        }

        return associationMapper.toDTO(associationRepository.save(user)); // Sauvegarde dans la BD
    }

}
