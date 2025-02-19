package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.services.implementation.PigeonService;
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
@RequestMapping("/api/public/pigeon")
public class PigeonController {
    @Autowired
    private PigeonService pigeonService;

    @PostMapping
    public ResponseEntity<ResponsePigeonDTO> createPigeon(@Valid @RequestBody CreatePigeonDTO createPigeonDTO) {
        ResponsePigeonDTO pigeon = pigeonService.create(createPigeonDTO);
        return new ResponseEntity<>(pigeon, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsePigeonDTO> getPigeonById(@Exists(entity = Pigeon.class , message = "Cette pigeon n'existe pas.")  @PathVariable("id") Long id) {
            ResponsePigeonDTO pigeon = pigeonService.findById(id);
            return new ResponseEntity<>(pigeon, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponsePigeonDTO>> getAllPigeonsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponsePigeonDTO> pigeons = pigeonService.findAll(page, size);
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

    @PutMapping("/{id}")
    public ResponseEntity<ResponsePigeonDTO> updatePigeon(@Exists(entity = Pigeon.class , message = "Cette pigeon n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdatePigeonDTO updatePigeonDTO) {

            ResponsePigeonDTO updatedPigeon = pigeonService.update(id, updatePigeonDTO);
            return new ResponseEntity<>(updatedPigeon, HttpStatus.OK);
    }


}
