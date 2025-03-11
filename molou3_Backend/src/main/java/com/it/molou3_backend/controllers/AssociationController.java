package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.services.implementation.AssociationService;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/public/association")
public class AssociationController {
    @Autowired
    private AssociationService associationService;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseAssociationDTO> getAssociationById(@Exists(entity = Association.class , message = "Cette association n'existe pas.")  @PathVariable("id") Long id) {
            ResponseAssociationDTO association = associationService.findById(id);
            return new ResponseEntity<>(association, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseAssociationDTO>> getAllAssociationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseAssociationDTO> associations = associationService.findAll(page, size);
        return new ResponseEntity<>(associations, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseAssociationDTO>> getAllAssociations() {
        List<ResponseAssociationDTO> associations = associationService.findAll();
        return new ResponseEntity<>(associations, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssociation(@Exists(entity = Association.class , message = "Cette association n'existe pas.") @PathVariable("id") Long id) {
            associationService.deleteById(id);
            return new ResponseEntity<>("Association est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResponseAssociationDTO> updateAssociation(
            @Exists(entity = Association.class, message = "Cette association n'existe pas.")
            @PathVariable("id") Long id,
            @Valid @RequestPart(value = "updateDTO", required = false) UpdateAssociationDTO updateAssociationDTO,
            @RequestPart(value = "preuveLegaleFile", required = false) MultipartFile preuveLegaleFile,
            @RequestPart(value = "photoFile", required = false) MultipartFile logoFile) throws IOException {

        if (updateAssociationDTO == null && preuveLegaleFile == null && logoFile == null) {
            throw new IllegalArgumentException("Aucune donnée fournie pour la mise à jour.");
        }

        ResponseAssociationDTO updatedAssociation = associationService.update(id, updateAssociationDTO, preuveLegaleFile, logoFile);
        return new ResponseEntity<>(updatedAssociation, HttpStatus.OK);
    }


}
