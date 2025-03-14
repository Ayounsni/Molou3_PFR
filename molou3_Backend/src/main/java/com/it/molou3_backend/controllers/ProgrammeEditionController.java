package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.ProgrammeEdition.CreateProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.ResponseProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.UpdateProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.services.implementation.ProgrammeEditionService;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/public/programmeEdition")
public class ProgrammeEditionController {
    @Autowired
    private ProgrammeEditionService programmeEditionService;

    @PostMapping
    public ResponseEntity<ResponseProgrammeEditionDTO> createProgrammeEdition(@Valid @RequestBody CreateProgrammeEditionDTO createProgrammeEditionDTO) {
        ResponseProgrammeEditionDTO programmeEdition = programmeEditionService.create(createProgrammeEditionDTO);
        return new ResponseEntity<>(programmeEdition, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseProgrammeEditionDTO> getProgrammeEditionById(@Exists(entity = ProgrammeEdition.class , message = "Ce programme edition n'existe pas.")  @PathVariable("id") Long id) {
            ResponseProgrammeEditionDTO programmeEdition = programmeEditionService.findById(id);
            return new ResponseEntity<>(programmeEdition, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseProgrammeEditionDTO>> getAllProgrammeEditionsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(required = false) Long associationId
    ) {
        PageDTO<ResponseProgrammeEditionDTO> programmeEditions;
        if (associationId != null) {
            programmeEditions = programmeEditionService.findByAssociationId(associationId, page, size);
        } else {
            programmeEditions = programmeEditionService.findAll(page, size);
        }
        return new ResponseEntity<>(programmeEditions, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseProgrammeEditionDTO>> getAllProgrammeEditions() {
        List<ResponseProgrammeEditionDTO> programmeEditions = programmeEditionService.findAll();
        return new ResponseEntity<>(programmeEditions, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProgrammeEdition(
            @Exists(entity = ProgrammeEdition.class, message = "Ce programme Edition n'existe pas.")
            @PathVariable("id") Long id) {

        programmeEditionService.deleteById(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "ProgrammeEdition est supprimé avec succès");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseProgrammeEditionDTO> updateProgrammeEdition(@Exists(entity = ProgrammeEdition.class , message = "Ce programme Edition n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdateProgrammeEditionDTO updateProgrammeEditionDTO) {

            ResponseProgrammeEditionDTO updatedProgrammeEdition = programmeEditionService.update(id, updateProgrammeEditionDTO);
            return new ResponseEntity<>(updatedProgrammeEdition, HttpStatus.OK);
    }


}
