package com.it.molou3_backend;

import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.mappers.GenericMapper;
import com.it.molou3_backend.services.implementation.GenericService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GenericServiceTest {

    @Mock
    private JpaRepository<Pigeon, Long> repository;

    @Mock
    private GenericMapper<Pigeon, CreatePigeonDTO, UpdatePigeonDTO, ResponsePigeonDTO> mapper;

    @InjectMocks
    private GenericService<Pigeon, CreatePigeonDTO, UpdatePigeonDTO, ResponsePigeonDTO> genericService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate_validData() {
        CreatePigeonDTO createDTO = new CreatePigeonDTO();
        Pigeon pigeonEntity = new Pigeon();
        ResponsePigeonDTO responseDTO = new ResponsePigeonDTO();

        when(mapper.toEntity(createDTO)).thenReturn(pigeonEntity);
        when(repository.save(pigeonEntity)).thenReturn(pigeonEntity);
        when(mapper.toDTO(pigeonEntity)).thenReturn(responseDTO);

        ResponsePigeonDTO result = genericService.create(createDTO);

        assertNotNull(result);
        assertEquals(responseDTO, result);
        verify(repository, times(1)).save(pigeonEntity);
        verify(mapper, times(1)).toDTO(pigeonEntity);
    }

    @Test
    void testCreate_nullData() {
        CreatePigeonDTO createDTO = null;

        assertThrows(NullPointerException.class, () -> {
            genericService.create(createDTO);
        });
    }

    @Test
    void testFindById_validId() {
        Long id = 1L;
        Pigeon pigeonEntity = new Pigeon();
        ResponsePigeonDTO responseDTO = new ResponsePigeonDTO();

        when(repository.findById(id)).thenReturn(Optional.of(pigeonEntity));
        when(mapper.toDTO(pigeonEntity)).thenReturn(responseDTO);

        ResponsePigeonDTO result = genericService.findById(id);

        assertNotNull(result);
        assertEquals(responseDTO, result);
        verify(repository, times(1)).findById(id);
    }

    @Test
    void testFindById_invalidId() {
        Long id = 999L;

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            genericService.findById(id);
        });
    }

    @Test
    void testFindAll_validPagination() {
        int page = 0;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size);
        Pigeon pigeonEntity = new Pigeon();
        ResponsePigeonDTO responseDTO = new ResponsePigeonDTO();
        Page<Pigeon> pagedResult = new PageImpl<>(List.of(pigeonEntity));

        when(repository.findAll(pageRequest)).thenReturn(pagedResult);
        when(mapper.toDTO(pigeonEntity)).thenReturn(responseDTO);

        PageDTO<ResponsePigeonDTO> result = genericService.findAll(page, size);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(responseDTO, result.getContent().get(0));
        verify(repository, times(1)).findAll(pageRequest);
    }

    @Test
    void testFindAll_emptyPage() {
        int page = 0;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Pigeon> emptyPage = Page.empty();

        when(repository.findAll(pageRequest)).thenReturn(emptyPage);

        PageDTO<ResponsePigeonDTO> result = genericService.findAll(page, size);

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        verify(repository, times(1)).findAll(pageRequest);
    }

    @Test
    void testDeleteById_validId() {
        Long id = 1L;

        genericService.deleteById(id);

        verify(repository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteById_invalidId() {
        Long id = 999L;

        doThrow(new RuntimeException("Entity not found")).when(repository).deleteById(id);

        assertThrows(RuntimeException.class, () -> {
            genericService.deleteById(id);
        });
    }

    @Test
    void testUpdate_validData() {
        Long id = 1L;
        UpdatePigeonDTO updateDTO = new UpdatePigeonDTO();
        Pigeon existingPigeon = new Pigeon();
        Pigeon updatedPigeon = new Pigeon();
        ResponsePigeonDTO responseDTO = new ResponsePigeonDTO();

        when(repository.findById(id)).thenReturn(Optional.of(existingPigeon));
        when(mapper.updateEntityFromDTO(updateDTO, existingPigeon)).thenReturn(updatedPigeon);
        when(repository.save(updatedPigeon)).thenReturn(updatedPigeon);
        when(mapper.toDTO(updatedPigeon)).thenReturn(responseDTO);

        ResponsePigeonDTO result = genericService.update(id, updateDTO);

        assertNotNull(result);
        assertEquals(responseDTO, result);
        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).save(updatedPigeon);
    }

    @Test
    void testUpdate_invalidId() {
        Long id = 999L;
        UpdatePigeonDTO updateDTO = new UpdatePigeonDTO();

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            genericService.update(id, updateDTO);
        });
    }

    @Test
    void testUpdate_nullData() {
        Long id = 1L;
        UpdatePigeonDTO updateDTO = null;

        assertThrows(NullPointerException.class, () -> {
            genericService.update(id, updateDTO);
        });
    }
}
