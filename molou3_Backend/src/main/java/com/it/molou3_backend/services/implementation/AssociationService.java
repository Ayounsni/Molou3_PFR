package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;
import com.it.molou3_backend.models.dtos.Search.SearchAssociationDTO;
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
import java.util.List;
import java.util.stream.Collectors;

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

        if (preuveLegaleFile != null && !preuveLegaleFile.isEmpty()) {
            String preuveLegaleUrl = fileUploadService.uploadFile(preuveLegaleFile); // URL générée
            user.setPreuveLegalePath(preuveLegaleUrl); // Assignée à l’entité
        } else {
            throw new IllegalArgumentException("La preuve légale est obligatoire pour une association.");
        }

        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = fileUploadService.uploadFile(logoFile);
            user.setPhotoUrl(logoUrl);
        }

        return associationMapper.toDTO(associationRepository.save(user));
    }

    @Override
    public ResponseAssociationDTO update(Long id, UpdateAssociationDTO updateDTO, MultipartFile preuveLegaleFile, MultipartFile logoFile) throws IOException {
        Association entity = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Association non trouvée avec l'ID : " + id));

        Association updatedEntity = mapper.updateEntityFromDTO(updateDTO, entity);

        if (preuveLegaleFile != null && !preuveLegaleFile.isEmpty()) {
            String preuveLegaleUrl = fileUploadService.uploadFile(preuveLegaleFile);
            updatedEntity.setPreuveLegalePath(preuveLegaleUrl);
        }

        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = fileUploadService.uploadFile(logoFile);
            updatedEntity.setPhotoUrl(logoUrl);
        }

        updatedEntity = repository.save(updatedEntity);
        return mapper.toDTO(updatedEntity);
    }

    @Override
    public List<ResponseAssociationDTO> searchAssociation(SearchAssociationDTO searchAssociationDTO) {
        if ((searchAssociationDTO.getNomAssociation() == null || searchAssociationDTO.getNomAssociation().trim().isEmpty()) &&
                (searchAssociationDTO.getVille() == null || searchAssociationDTO.getVille().trim().isEmpty())) {
            throw new IllegalArgumentException("Veuillez fournir au moins un critère de recherche (nom de l'association ou ville).");
        }

        List<Association> associations = associationRepository.findByNomAssociationOrVille(
                searchAssociationDTO.getNomAssociation(),
                searchAssociationDTO.getVille()
        );

        return associations.stream()
                .map(associationMapper::toDTO)
                .collect(Collectors.toList());
    }


}
