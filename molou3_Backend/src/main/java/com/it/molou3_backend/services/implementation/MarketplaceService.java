package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Marketplace.CreateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.ResponseMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.UpdateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.entities.Marketplace;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
import com.it.molou3_backend.models.enums.StatusVente;
import com.it.molou3_backend.models.mappers.MarketplaceMapper;
import com.it.molou3_backend.repository.MarketplaceRepository;
import com.it.molou3_backend.repository.PigeonRepository;
import com.it.molou3_backend.services.interfaces.IMarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MarketplaceService extends GenericService<Marketplace,CreateMarketplaceDTO,UpdateMarketplaceDTO,ResponseMarketplaceDTO> implements IMarketplaceService {

    public MarketplaceService(MarketplaceRepository marketplaceRepository, MarketplaceMapper marketplaceMapper) {
        super(marketplaceRepository, marketplaceMapper);
    }
    @Autowired
    private  MarketplaceRepository marketplaceRepository;
    @Autowired
    private PigeonRepository pigeonRepository;
    @Autowired
    public MarketplaceMapper marketplaceMapper;

    @Override
    @Transactional
    public ResponseMarketplaceDTO create(CreateMarketplaceDTO createMarketplaceDTO) {
        Marketplace marketplace = marketplaceMapper.toEntity(createMarketplaceDTO);

        Pigeon pigeon = marketplace.getPigeon();
        if (pigeon != null) {
            pigeon.setStatusPigeon(StatusPigeon.A_VENDRE);
            pigeonRepository.save(pigeon);
        }

        Marketplace savedMarketplace = marketplaceRepository.save(marketplace);
        return marketplaceMapper.toDTO(savedMarketplace);
    }

    @Override
    @Transactional
    public ResponseMarketplaceDTO update(Long id, UpdateMarketplaceDTO updateMarketplaceDTO) {
        Marketplace marketplace = marketplaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Marketplace non trouvée"));

        Marketplace updatedMarketplace = marketplaceMapper.updateEntityFromDTO(updateMarketplaceDTO, marketplace);

        if (updatedMarketplace.getStatusVente() == StatusVente.VENDU) {
            Pigeon pigeon = updatedMarketplace.getPigeon();
            if (pigeon != null) {
                pigeon.setStatusPigeon(StatusPigeon.VENDU);
                pigeonRepository.save(pigeon);
            }
        }

        return marketplaceMapper.toDTO(marketplaceRepository.save(updatedMarketplace));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Marketplace marketplace = marketplaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marketplace non trouvée"));

        if (marketplace.getPigeon() != null) {
            Pigeon pigeon = marketplace.getPigeon();
            pigeon.setMarketplace(null);
            pigeon.setStatusPigeon(StatusPigeon.DISPONIBLE);
            pigeonRepository.save(pigeon);
        }

        marketplaceRepository.delete(marketplace);
    }

    @Override
    public PageDTO<ResponseMarketplaceDTO> findAllByFilters(int page, int size, String status, String ville, String nationalite, String sexe, Double prixMin, Double prixMax) {
        Pageable pageable = PageRequest.of(page, size);

        Sexe sexeEnum = sexe != null ? Sexe.valueOf(sexe) : null;
        Page<Marketplace> marketplacePage = marketplaceRepository.findByFilters(
                StatusVente.valueOf(status), ville, nationalite, sexeEnum, prixMin, prixMax, pageable);

        PageDTO<ResponseMarketplaceDTO> pageDTO = new PageDTO<>();
        pageDTO.setContent(marketplaceMapper.toDTOs(marketplacePage.getContent()));
        pageDTO.setPageNumber(marketplacePage.getNumber());
        pageDTO.setPageSize(marketplacePage.getSize());
        pageDTO.setTotalElements(marketplacePage.getTotalElements());
        pageDTO.setTotalPages(marketplacePage.getTotalPages());
        pageDTO.setLast(marketplacePage.isLast());

        return pageDTO;
    }

}
