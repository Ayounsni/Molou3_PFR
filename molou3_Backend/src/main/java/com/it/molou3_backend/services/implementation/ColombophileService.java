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


    @Override
    public ResponseColombophileDTO create(CreateColombophileDTO createColombophileDTO) {

        if (colombophileRepository.findByEmail(createColombophileDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cette email existe déjà.");
        }
        if (haveIBeenPwnedService.isPasswordPwned(createColombophileDTO.getPassword())) {
            throw new IllegalArgumentException("Le mot de passe est compromis. Veuillez en choisir un autre.");
        }
        Colombophile user = colombophileMapper.toEntity(createColombophileDTO);
        user.setPassword(passwordEncoder.encode(createColombophileDTO.getPassword()));
        return colombophileMapper.toDTO(colombophileRepository.save(user)) ;
    }

}
