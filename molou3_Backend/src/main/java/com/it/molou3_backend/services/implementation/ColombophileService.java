package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.UpdateColombophileDTO;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.mappers.ColombophileMapper;
import com.it.molou3_backend.repository.ColombophileRepository;
import com.it.molou3_backend.security.services.implementations.HaveIBeenPwnedService;
import com.it.molou3_backend.services.interfaces.IColombophileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ColombophileService extends GenericService<Colombophile,CreateColombophileDTO,UpdateColombophileDTO,ResponseColombophileDTO> implements IColombophileService {

    public ColombophileService(ColombophileRepository colombophileRepository, ColombophileMapper colombophileMapper) {
        super(colombophileRepository, colombophileMapper);
    }

    @Autowired
    public ColombophileRepository colombophileRepository;
    @Autowired
    public ColombophileMapper colombophileMapper;
    @Autowired
    public PasswordEncoder passwordEncoder;
    @Autowired
    public HaveIBeenPwnedService haveIBeenPwnedService;
    @Autowired
    public FileUploadService fileUploadService;


    @Override
    public ResponseColombophileDTO create(CreateColombophileDTO createColombophileDTO, MultipartFile photoFile) throws IOException {
        if (colombophileRepository.findByEmail(createColombophileDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cette email existe déjà.");
        }
        if (haveIBeenPwnedService.isPasswordPwned(createColombophileDTO.getPassword())) {
            throw new IllegalArgumentException("Le mot de passe est compromis. Veuillez en choisir un autre.");
        }
        Colombophile user = colombophileMapper.toEntity(createColombophileDTO);
        user.setPassword(passwordEncoder.encode(createColombophileDTO.getPassword()));

        // Upload et stockage de la photo
        if (photoFile != null && !photoFile.isEmpty()) {
            String photoUrl = fileUploadService.uploadFile(photoFile); // URL générée
            user.setPhotoUrl(photoUrl); // Assignée à l’entité
        }

        return colombophileMapper.toDTO(colombophileRepository.save(user)); // Sauvegarde dans la BD
    }

}
