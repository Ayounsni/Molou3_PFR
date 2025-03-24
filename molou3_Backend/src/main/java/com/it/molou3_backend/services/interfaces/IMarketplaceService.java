package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Marketplace.CreateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.ResponseMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.UpdateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;

public interface IMarketplaceService extends IGenericService<CreateMarketplaceDTO,UpdateMarketplaceDTO,ResponseMarketplaceDTO> {
    PageDTO<ResponseMarketplaceDTO> findAllByFilters(int page, int size, String status, String ville, String nationalite, String sexe, Double prixMin, Double prixMax);
}
