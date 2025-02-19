package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Marketplace.CreateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.ResponseMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.UpdateMarketplaceDTO;
import com.it.molou3_backend.models.entities.Marketplace;
import com.it.molou3_backend.models.mappers.MarketplaceMapper;
import com.it.molou3_backend.repository.MarketplaceRepository;
import com.it.molou3_backend.services.interfaces.IMarketplaceService;
import org.springframework.stereotype.Service;

@Service
public class MarketplaceService extends GenericService<Marketplace,CreateMarketplaceDTO,UpdateMarketplaceDTO,ResponseMarketplaceDTO> implements IMarketplaceService {

    public MarketplaceService(MarketplaceRepository marketplaceRepository, MarketplaceMapper marketplaceMapper) {
        super(marketplaceRepository, marketplaceMapper);
    }

}
