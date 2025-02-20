package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.UpdateColombophileDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.services.implementation.ColombophileService;
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
@RequestMapping("/api/public/colombophile")
public class ColombophileController {
    @Autowired
    private ColombophileService colombophileService;



    @GetMapping("/{id}")
    public ResponseEntity<ResponseColombophileDTO> getColombophileById(@Exists(entity = Colombophile.class , message = "Cette colombophile n'existe pas.")  @PathVariable("id") Long id) {
            ResponseColombophileDTO colombophile = colombophileService.findById(id);
            return new ResponseEntity<>(colombophile, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseColombophileDTO>> getAllColombophilesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseColombophileDTO> colombophiles = colombophileService.findAll(page, size);
        return new ResponseEntity<>(colombophiles, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseColombophileDTO>> getAllColombophiles() {
        List<ResponseColombophileDTO> colombophiles = colombophileService.findAll();
        return new ResponseEntity<>(colombophiles, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteColombophile(@Exists(entity = Colombophile.class , message = "Cette colombophile n'existe pas.") @PathVariable("id") Long id) {
            colombophileService.deleteById(id);
            return new ResponseEntity<>("Colombophile est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseColombophileDTO> updateColombophile(@Exists(entity = Colombophile.class , message = "Cette colombophile n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdateColombophileDTO updateColombophileDTO) {

            ResponseColombophileDTO updatedColombophile = colombophileService.update(id, updateColombophileDTO);
            return new ResponseEntity<>(updatedColombophile, HttpStatus.OK);
    }


}
