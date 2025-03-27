package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.services.implementation.PigeonService;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
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
@RequestMapping("/api/public/pigeon")
public class PigeonController {
    @Autowired
    private PigeonService pigeonService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponsePigeonDTO> createPigeon(
            @Valid @RequestPart(value = "data", required = false) CreatePigeonDTO createPigeonDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) throws IOException {
        if (createPigeonDTO == null) {
            throw new IllegalArgumentException("Les données de création sont requises.");
        }

        try {
            ResponsePigeonDTO pigeon = pigeonService.create(createPigeonDTO, photoFile);
            return new ResponseEntity<>(pigeon, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Ou un message d’erreur personnalisé
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsePigeonDTO> getPigeonById(@Exists(entity = Pigeon.class , message = "Cette pigeon n'existe pas.")  @PathVariable("id") Long id) {
            ResponsePigeonDTO pigeon = pigeonService.findById(id);
            return new ResponseEntity<>(pigeon, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<PageDTO<ResponsePigeonDTO>> getAllPigeonsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(required = false) Long colombophileId
    ) {
        PageDTO<ResponsePigeonDTO> pigeons;
        if (colombophileId != null) {
            pigeons = pigeonService.findByColombophileId(colombophileId, page, size);
        } else {
            pigeons = pigeonService.findAll(page, size);
        }
        return new ResponseEntity<>(pigeons, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponsePigeonDTO>> getAllPigeons() {
        List<ResponsePigeonDTO> pigeons = pigeonService.findAll();
        return new ResponseEntity<>(pigeons, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePigeon(@Exists(entity = Pigeon.class , message = "Cette pigeon n'existe pas.") @PathVariable("id") Long id) {
            pigeonService.deleteById(id);
            return new ResponseEntity<>("Pigeon est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponsePigeonDTO> updatePigeon(
            @Exists(entity = Pigeon.class, message = "Ce pigeon n'existe pas.")
            @PathVariable("id") Long id,
            @Valid @RequestPart(value = "updateDTO", required = false) UpdatePigeonDTO updatePigeonDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) throws IOException {
        if (updatePigeonDTO == null && photoFile == null) {
            throw new IllegalArgumentException("Aucune donnée fournie pour la mise à jour.");
        }

        ResponsePigeonDTO updatedPigeon = pigeonService.update(id, updatePigeonDTO, photoFile);
        return new ResponseEntity<>(updatedPigeon, HttpStatus.OK);
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendPigeonToOwner(
            @RequestParam("email") @Email(message = "L'email doit être valide") @NotNull(message = "L'email est requis") String email,
            @RequestParam("pigeonId") @NotNull(message = "L'ID du pigeon est requis") Long pigeonId) {
        try {
            pigeonService.sendPigeon(email, pigeonId);
            return new ResponseEntity<>("Pigeon est envoyé avec succès", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Une erreur inattendue est survenue", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
