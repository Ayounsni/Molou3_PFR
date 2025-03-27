package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.UpdateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.models.mappers.AnnonceMapper;
import com.it.molou3_backend.repository.AnnonceRepository;
import com.it.molou3_backend.services.interfaces.IAnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnonceService extends GenericService<Annonce,CreateAnnonceDTO,UpdateAnnonceDTO,ResponseAnnonceDTO> implements IAnnonceService {

    @Autowired
    AnnonceRepository annonceRepository;
    public AnnonceService(AnnonceRepository annonceRepository, AnnonceMapper annonceMapper) {
        super(annonceRepository, annonceMapper);
    }

    @Override
    public PageDTO<ResponseAnnonceDTO> findByAssociationId(Long associationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Annonce> editionsPage = annonceRepository.findByAssociationId(associationId, pageable);
        List<ResponseAnnonceDTO> dtos = editionsPage.getContent().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
        return new PageDTO<>(
                dtos,
                editionsPage.getNumber(),
                editionsPage.getSize(),
                editionsPage.getTotalElements(),
                editionsPage.getTotalPages(),
                editionsPage.isLast()
        );
    }

}
