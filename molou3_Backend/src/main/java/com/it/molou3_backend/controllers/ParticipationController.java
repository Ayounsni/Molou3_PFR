package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.UpdateParticipationDTO;
import com.it.molou3_backend.services.implementation.ParticipationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Validated
@RestController
@RequestMapping("/api/public/participation")
public class ParticipationController {
    @Autowired
    private ParticipationService participationService;

    @PostMapping
    public ResponseEntity<ResponseParticipationDTO> createParticipation(@Valid @RequestBody CreateParticipationDTO createParticipationDTO) {
        ResponseParticipationDTO participation = participationService.create(createParticipationDTO);
        return new ResponseEntity<>(participation, HttpStatus.OK);
    }

    @GetMapping("/{pigeonId}/{competitionId}")
    public ResponseEntity<ResponseParticipationDTO> getParticipationById( @PathVariable("pigeonId") Long pigeonId,@PathVariable("competitionId") Long competitionId) {
            ResponseParticipationDTO participation = participationService.findById(pigeonId,competitionId);
            return new ResponseEntity<>(participation, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseParticipationDTO>> getAllParticipationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseParticipationDTO> participations = participationService.findAll(page, size);
        return new ResponseEntity<>(participations, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseParticipationDTO>> getAllParticipations() {
        List<ResponseParticipationDTO> participations = participationService.findAll();
        return new ResponseEntity<>(participations, HttpStatus.OK);
    }
    @DeleteMapping("/{pigeonId}/{competitionId}")
    public ResponseEntity<String> deleteParticipation(@PathVariable("pigeonId") Long pigeonId,@PathVariable("competitionId") Long competitionId) {
            participationService.deleteById(pigeonId,competitionId);
            return new ResponseEntity<>("Participation est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{pigeonId}/{competitionId}")
    public ResponseEntity<ResponseParticipationDTO> updateParticipation( @PathVariable("pigeonId") Long pigeonId,@PathVariable("competitionId") Long competitionId, @Valid @RequestBody UpdateParticipationDTO updateParticipationDTO) {

            ResponseParticipationDTO updatedParticipation = participationService.update(pigeonId,competitionId, updateParticipationDTO);
            return new ResponseEntity<>(updatedParticipation, HttpStatus.OK);
    }


}
