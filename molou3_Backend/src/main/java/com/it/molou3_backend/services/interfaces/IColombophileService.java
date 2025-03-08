package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.UpdateColombophileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IColombophileService extends IGenericService<CreateColombophileDTO,UpdateColombophileDTO,ResponseColombophileDTO> {
    ResponseColombophileDTO create(CreateColombophileDTO createColombophileDTO, MultipartFile photoFile) throws IOException;
}
