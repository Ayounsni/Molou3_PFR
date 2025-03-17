package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.UpdateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.services.implementation.AnnonceService;
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
@RequestMapping("/api/public/annonce")
public class AnnonceController {
    @Autowired
    private AnnonceService annonceService;

    @PostMapping
    public ResponseEntity<ResponseAnnonceDTO> createAnnonce(@Valid @RequestBody CreateAnnonceDTO createAnnonceDTO) {
        ResponseAnnonceDTO annonce = annonceService.create(createAnnonceDTO);
        return new ResponseEntity<>(annonce, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseAnnonceDTO> getAnnonceById(@Exists(entity = Annonce.class , message = "Cette annonce n'existe pas.")  @PathVariable("id") Long id) {
            ResponseAnnonceDTO annonce = annonceService.findById(id);
            return new ResponseEntity<>(annonce, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseAnnonceDTO>> getAllAnnoncesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(required = false) Long associationId
    ) {
        PageDTO<ResponseAnnonceDTO> annonces;
        if (associationId != null) {
            annonces = annonceService.findByAssociationId(associationId, page, size);
        } else {
            annonces = annonceService.findAll(page, size);
        }
        return new ResponseEntity<>(annonces, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseAnnonceDTO>> getAllAnnonces() {
        List<ResponseAnnonceDTO> annonces = annonceService.findAll();
        return new ResponseEntity<>(annonces, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnonce(@Exists(entity = Annonce.class , message = "Cette annonce n'existe pas.") @PathVariable("id") Long id) {
            annonceService.deleteById(id);
            return new ResponseEntity<>("Annonce est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseAnnonceDTO> updateAnnonce(@Exists(entity = Annonce.class , message = "Cette annonce n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdateAnnonceDTO updateAnnonceDTO) {

            ResponseAnnonceDTO updatedAnnonce = annonceService.update(id, updateAnnonceDTO);
            return new ResponseEntity<>(updatedAnnonce, HttpStatus.OK);
    }


}
