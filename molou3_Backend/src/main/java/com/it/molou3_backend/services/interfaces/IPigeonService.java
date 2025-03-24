package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IPigeonService extends IGenericService<CreatePigeonDTO,UpdatePigeonDTO,ResponsePigeonDTO> {
    ResponsePigeonDTO create(CreatePigeonDTO createPigeonDTO, MultipartFile photoFile) throws IOException;
    ResponsePigeonDTO update(Long id, UpdatePigeonDTO updatePigeonDTO, MultipartFile photoFile) throws IOException;
    PageDTO<ResponsePigeonDTO> findByColombophileId(Long colombophileId, int page, int size);
    void sendPigeon(String email,Long pigeonId);
}
