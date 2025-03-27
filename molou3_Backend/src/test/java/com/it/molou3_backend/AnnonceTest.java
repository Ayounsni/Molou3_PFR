package com.it.molou3_backend;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.models.mappers.AnnonceMapper;
import com.it.molou3_backend.repository.AnnonceRepository;
import com.it.molou3_backend.services.implementation.AnnonceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnnonceServiceTest {

    @Mock
    private AnnonceRepository annonceRepository;

    @Mock
    private AnnonceMapper annonceMapper;

    @InjectMocks
    private AnnonceService annonceService;

    private Annonce annonce;
    private ResponseAnnonceDTO responseDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialisation manuelle des mocks

        annonce = new Annonce();
        annonce.setId(1L);
        annonce.setTitre("Annonce importante");

        responseDTO = new ResponseAnnonceDTO();
        responseDTO.setId(1L);
        responseDTO.setTitre("Annonce importante");
    }

    @Test
    void createAnnonce_WithValidData_ShouldReturnDTO() {
        // Arrange
        CreateAnnonceDTO createDTO = new CreateAnnonceDTO();
        createDTO.setTitre("Nouvelle annonce");

        when(annonceMapper.toEntity(createDTO)).thenReturn(annonce);
        when(annonceRepository.save(annonce)).thenReturn(annonce);
        when(annonceMapper.toDTO(annonce)).thenReturn(responseDTO);

        // Act
        ResponseAnnonceDTO result = annonceService.create(createDTO);

        // Assert
        assertNotNull(result);
        assertEquals(responseDTO.getTitre(), result.getTitre());
        verify(annonceRepository).save(annonce);
    }

    @Test
    void deleteAnnonce_WithValidId_ShouldPerformDeletion() {
        // Act
        annonceService.deleteById(1L);

        // Assert
        verify(annonceRepository).deleteById(1L);
    }

    @Test
    void findById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(annonceRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> annonceService.findById(999L));
    }
}