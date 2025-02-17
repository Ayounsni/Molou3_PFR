package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Plate.CreatePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.ResponsePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.UpdatePlateDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Plate;
import com.it.molou3_backend.services.implementation.PlateService;
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
@RequestMapping("/api/public/plate")
public class PlateController {
    @Autowired
    private PlateService plateService;

    @PostMapping
    public ResponseEntity<ResponsePlateDTO> createPlate(@Valid @RequestBody CreatePlateDTO createPlateDTO) {
        ResponsePlateDTO plate = plateService.create(createPlateDTO);
        return new ResponseEntity<>(plate, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsePlateDTO> getPlateById(@Exists(entity = Plate.class , message = "Cet plate n'existe pas.")  @PathVariable("id") Long id) {
            ResponsePlateDTO plate = plateService.findById(id);
            return new ResponseEntity<>(plate, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponsePlateDTO>> getAllPlatesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponsePlateDTO> plates = plateService.findAll(page, size);
        return new ResponseEntity<>(plates, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponsePlateDTO>> getAllPlates() {
        List<ResponsePlateDTO> plates = plateService.findAll();
        return new ResponseEntity<>(plates, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlate(@Exists(entity = Plate.class , message = "Cet plate n'existe pas.") @PathVariable("id") Long id) {
            plateService.deleteById(id);
            return new ResponseEntity<>("Plate est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponsePlateDTO> updatePlate(@Exists(entity = Plate.class , message = "Cet plate n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdatePlateDTO updatePlateDTO) {

            ResponsePlateDTO updatedPlate = plateService.update(id, updatePlateDTO);
            return new ResponseEntity<>(updatedPlate, HttpStatus.OK);
    }


}
