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

@Service
public class AssociationService extends GenericService<Association,CreateAssociationDTO,UpdateAssociationDTO,ResponseAssociationDTO> implements IAssociationService {

    public AssociationService(AssociationRepository plateRepository, AssociationMapper plateMapper) {
        super(plateRepository, plateMapper);
    }
    @Autowired
    public  AssociationRepository associationRepository;
    @Autowired
    public  AssociationMapper associationMapper;
    @Autowired
    public  PasswordEncoder passwordEncoder;
    @Autowired
    public  HaveIBeenPwnedService haveIBeenPwnedService;


    @Override
    public ResponseAssociationDTO create(CreateAssociationDTO createAssociationDTO) {

        if (associationRepository.findByEmail(createAssociationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cette email existe déjà.");
        }
        if (haveIBeenPwnedService.isPasswordPwned(createAssociationDTO.getPassword())) {
            throw new IllegalArgumentException("Le mot de passe est compromis. Veuillez en choisir un autre.");
        }
        Association user = associationMapper.toEntity(createAssociationDTO);
        user.setPassword(passwordEncoder.encode(createAssociationDTO.getPassword()));
        return associationMapper.toDTO(associationRepository.save(user)) ;
    }

}
