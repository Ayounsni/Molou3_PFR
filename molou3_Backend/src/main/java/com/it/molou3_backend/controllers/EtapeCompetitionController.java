package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.EtapeCompetition.CreateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.ResponseEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.UpdateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.services.implementation.EtapeCompetitionService;
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
@RequestMapping("/api/public/etapeCompetition")
public class EtapeCompetitionController {
    @Autowired
    private EtapeCompetitionService etapeCompetitionService;

    @PostMapping
    public ResponseEntity<ResponseEtapeCompetitionDTO> createEtapeCompetition(@Valid @RequestBody CreateEtapeCompetitionDTO createEtapeCompetitionDTO) {
        ResponseEtapeCompetitionDTO etapeCompetition = etapeCompetitionService.create(createEtapeCompetitionDTO);
        return new ResponseEntity<>(etapeCompetition, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseEtapeCompetitionDTO> getEtapeCompetitionById(@Exists(entity = EtapeCompetition.class , message = "Cette etapeCompetition n'existe pas.")  @PathVariable("id") Long id) {
            ResponseEtapeCompetitionDTO etapeCompetition = etapeCompetitionService.findById(id);
            return new ResponseEntity<>(etapeCompetition, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseEtapeCompetitionDTO>> getAllEtapeCompetitionsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseEtapeCompetitionDTO> etapeCompetitions = etapeCompetitionService.findAll(page, size);
        return new ResponseEntity<>(etapeCompetitions, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseEtapeCompetitionDTO>> getAllEtapeCompetitions() {
        List<ResponseEtapeCompetitionDTO> etapeCompetitions = etapeCompetitionService.findAll();
        return new ResponseEntity<>(etapeCompetitions, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEtapeCompetition(@Exists(entity = EtapeCompetition.class , message = "Cette etapeCompetition n'existe pas.") @PathVariable("id") Long id) {
            etapeCompetitionService.deleteById(id);
            return new ResponseEntity<>("EtapeCompetition est supprimé avec succès", HttpStatus.OK);
    }

    @DeleteMapping("/etapeClassement/{id}")
    public ResponseEntity<String> deleteEtapeCompetitionClassement(@Exists(entity = EtapeCompetition.class , message = "Cette etapeCompetition n'existe pas.") @PathVariable("id") Long id) {
        etapeCompetitionService.deleteClassement(id);
        return new ResponseEntity<>("Classement est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseEtapeCompetitionDTO> updateEtapeCompetition(
            @Exists(entity = EtapeCompetition.class, message = "Cette étape de compétition n'existe pas.")
            @PathVariable("id") Long id,
            @Valid @RequestPart(value = "updateDTO", required = false) UpdateEtapeCompetitionDTO updateEtapeCompetitionDTO,
            @RequestPart(value = "classementFile", required = false) MultipartFile pdfClassementFile) throws IOException {

        if (updateEtapeCompetitionDTO == null && pdfClassementFile == null) {
            throw new IllegalArgumentException("Aucune donnée fournie pour la mise à jour.");
        }

        assert updateEtapeCompetitionDTO != null;
        ResponseEtapeCompetitionDTO updatedEtapeCompetition = etapeCompetitionService.update(id, updateEtapeCompetitionDTO, pdfClassementFile);
        return new ResponseEntity<>(updatedEtapeCompetition, HttpStatus.OK);
    }

}
