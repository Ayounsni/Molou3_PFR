package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.StatusPigeon;
import com.it.molou3_backend.models.mappers.PigeonMapper;
import com.it.molou3_backend.repository.ColombophileRepository;
import com.it.molou3_backend.repository.PigeonRepository;
import com.it.molou3_backend.services.interfaces.IPigeonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PigeonService extends GenericService<Pigeon,CreatePigeonDTO,UpdatePigeonDTO,ResponsePigeonDTO> implements IPigeonService {

    @Autowired
    public FileUploadService fileUploadService;
    @Autowired
    public PigeonRepository pigeonRepository;
    @Autowired
    public ColombophileRepository colombophileRepository;

    public PigeonService(PigeonRepository pigeonRepository, PigeonMapper pigeonMapper) {
        super(pigeonRepository, pigeonMapper);
    }

    @Override
    public ResponsePigeonDTO create(CreatePigeonDTO createPigeonDTO, MultipartFile photoFile) throws IOException {

        Pigeon pigeon = mapper.toEntity(createPigeonDTO);

        if (photoFile != null && !photoFile.isEmpty()) {
            String photoUrl = fileUploadService.uploadFile(photoFile); // URL générée
            pigeon.setPhotoUrl(photoUrl); // Assignée à l’entité
        }

        return mapper.toDTO(repository.save(pigeon));
    }

    @Override
    public ResponsePigeonDTO update(Long id, UpdatePigeonDTO updatePigeonDTO, MultipartFile photoFile) throws IOException {
        Pigeon entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pigeon non trouvé avec l'ID : " + id));

        Pigeon updatedEntity = mapper.updateEntityFromDTO(updatePigeonDTO, entity);

        if (photoFile != null && !photoFile.isEmpty()) {
            String photoUrl = fileUploadService.uploadFile(photoFile);
            updatedEntity.setPhotoUrl(photoUrl);
        }

        updatedEntity = repository.save(updatedEntity);
        return mapper.toDTO(updatedEntity);
    }

    @Override
    public PageDTO<ResponsePigeonDTO> findByColombophileId(Long colombophileId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pigeon> pigeonPage = pigeonRepository.findByColombophileId(colombophileId, pageable);
        List<ResponsePigeonDTO> dtos = pigeonPage.getContent().stream()
                .map(mapper::toDTO) // Assurez-vous d'avoir une méthode pour convertir l'entité en DTO
                .collect(Collectors.toList());
        return new PageDTO<>(
                dtos,
                pigeonPage.getNumber(),
                pigeonPage.getSize(),
                pigeonPage.getTotalElements(),
                pigeonPage.getTotalPages(),
                pigeonPage.isLast()
        );
    }

    @Override
    public void sendPigeon(String email,Long pigeonId) {

        Colombophile colombophile = colombophileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Aucun colombophile n'a été trouvé avec cet e-mail."));
        Pigeon pigeon = pigeonRepository.findById(pigeonId).orElseThrow(() -> new RuntimeException("Pigeon n'existe pas"));
        pigeon.setColombophile(colombophile);
        pigeon.setStatusPigeon(StatusPigeon.DISPONIBLE);
        pigeonRepository.save(pigeon);
    }

}
