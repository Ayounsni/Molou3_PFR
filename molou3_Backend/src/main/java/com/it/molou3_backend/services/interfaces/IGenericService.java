package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;

import java.util.List;

public interface IGenericService<CreateDTO, UpdateDTO, ResponseDTO> {
    ResponseDTO create(CreateDTO createDTO);
    ResponseDTO findById(Long id);
    PageDTO<ResponseDTO> findAll(int page, int size);
    void deleteById(Long id);
    ResponseDTO update(Long id, UpdateDTO updateDTO);
    List<ResponseDTO> findAll();
}

