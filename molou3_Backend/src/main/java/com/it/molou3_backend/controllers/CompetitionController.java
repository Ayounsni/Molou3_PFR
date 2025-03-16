package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Competition.CreateCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.ResponseCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.UpdateCompetitionDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Competition;
import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.services.implementation.CompetitionService;
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
@RequestMapping("/api/public/competition")
public class CompetitionController {
    @Autowired
    private CompetitionService competitionService;

    @PostMapping
    public ResponseEntity<ResponseCompetitionDTO> createCompetition(@Valid @RequestBody CreateCompetitionDTO createCompetitionDTO) {
        ResponseCompetitionDTO competition = competitionService.create(createCompetitionDTO);
        return new ResponseEntity<>(competition, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseCompetitionDTO> getCompetitionById(@Exists(entity = Competition.class , message = "Cette compétition n'existe pas.")  @PathVariable("id") Long id) {
            ResponseCompetitionDTO competition = competitionService.findById(id);
            return new ResponseEntity<>(competition, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseCompetitionDTO>> getAllCompetitionsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseCompetitionDTO> competitions = competitionService.findAll(page, size);
        return new ResponseEntity<>(competitions, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseCompetitionDTO>> getAllCompetitions() {
        List<ResponseCompetitionDTO> competitions = competitionService.findAll();
        return new ResponseEntity<>(competitions, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompetition(@Exists(entity = Competition.class , message = "Cette compétition n'existe pas.") @PathVariable("id") Long id) {
            competitionService.deleteById(id);
            return new ResponseEntity<>("Competition est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseCompetitionDTO> updateCompetition(
            @Exists(entity = Competition.class, message = "Cette compétition n'existe pas.")
            @PathVariable("id") Long id,
            @Valid @RequestPart(value = "updateDTO", required = false) UpdateCompetitionDTO updateCompetitionDTO,
            @RequestPart(value = "classementFile", required = false) MultipartFile pdfClassementFile) throws IOException {

        if (updateCompetitionDTO == null && pdfClassementFile == null) {
            throw new IllegalArgumentException("Aucune donnée fournie pour la mise à jour.");
        }

        assert updateCompetitionDTO != null;
        ResponseCompetitionDTO updatedCompetition = competitionService.update(id, updateCompetitionDTO, pdfClassementFile);
        return new ResponseEntity<>(updatedCompetition, HttpStatus.OK);
    }

    @DeleteMapping("/competitionClassement/{id}")
    public ResponseEntity<String> deleteCompetitionClassement(@Exists(entity = Competition.class , message = "Cette Competition n'existe pas.") @PathVariable("id") Long id) {
        competitionService.deleteClassement(id);
        return new ResponseEntity<>("Classement est supprimé avec succès", HttpStatus.OK);
    }

}
