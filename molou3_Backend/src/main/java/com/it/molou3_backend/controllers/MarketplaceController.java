package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Marketplace.CreateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.ResponseMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.UpdateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Marketplace;
import com.it.molou3_backend.services.implementation.MarketplaceService;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/public/marketplace")
public class MarketplaceController {
    @Autowired
    private MarketplaceService marketplaceService;

    @PostMapping
    public ResponseEntity<ResponseMarketplaceDTO> createMarketplace(@Valid @RequestBody CreateMarketplaceDTO createMarketplaceDTO) {
        ResponseMarketplaceDTO marketplace = marketplaceService.create(createMarketplaceDTO);
        return new ResponseEntity<>(marketplace, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseMarketplaceDTO> getMarketplaceById(@Exists(entity = Marketplace.class , message = "Cette marketplace n'existe pas.")  @PathVariable("id") Long id) {
            ResponseMarketplaceDTO marketplace = marketplaceService.findById(id);
            return new ResponseEntity<>(marketplace, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseMarketplaceDTO>> getAllMarketplacesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseMarketplaceDTO> marketplaces = marketplaceService.findAll(page, size);
        return new ResponseEntity<>(marketplaces, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseMarketplaceDTO>> getAllMarketplaces() {
        List<ResponseMarketplaceDTO> marketplaces = marketplaceService.findAll();
        return new ResponseEntity<>(marketplaces, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMarketplace(@Exists(entity = Marketplace.class , message = "Cette marketplace n'existe pas.") @PathVariable("id") Long id) {
            marketplaceService.deleteById(id);
            return new ResponseEntity<>("Marketplace est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMarketplaceDTO> updateMarketplace(@Exists(entity = Marketplace.class , message = "Cette marketplace n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdateMarketplaceDTO updateMarketplaceDTO) {

            ResponseMarketplaceDTO updatedMarketplace = marketplaceService.update(id, updateMarketplaceDTO);
            return new ResponseEntity<>(updatedMarketplace, HttpStatus.OK);
    }


}
