package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.entities.Participation;
import com.it.molou3_backend.services.implementation.ParticipationService;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


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

//    @GetMapping("/{id}")
//    public ResponseEntity<ResponseParticipationDTO> getParticipationById(@Exists(entity = Participation.class , message = "Cette participation n'existe pas.")  @PathVariable("id") Long id) {
//            ResponseParticipationDTO participation = participationService.findById(id);
//            return new ResponseEntity<>(participation, HttpStatus.OK);
//    }
//    @GetMapping
//    public ResponseEntity<PageDTO<ResponseParticipationDTO>> getAllParticipationsPaginated(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "3") int size
//    ) {
//        PageDTO<ResponseParticipationDTO> participations = participationService.findAll(page, size);
//        return new ResponseEntity<>(participations, HttpStatus.OK);
//    }
//    @GetMapping("/all")
//    public ResponseEntity<List<ResponseParticipationDTO>> getAllParticipations() {
//        List<ResponseParticipationDTO> participations = participationService.findAll();
//        return new ResponseEntity<>(participations, HttpStatus.OK);
//    }
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteParticipation(@Exists(entity = Participation.class , message = "Cette participation n'existe pas.") @PathVariable("id") Long id) {
//            participationService.deleteById(id);
//            return new ResponseEntity<>("Participation est supprimé avec succès", HttpStatus.OK);
//    }
//
    @PutMapping("/{pigeonId}/{competitionId}")
    public ResponseEntity<ResponseParticipationDTO> updateParticipation(@Exists(entity = Participation.class , message = "Cette participation n'existe pas.") @PathVariable("pigeonId") Long id, @Valid @RequestBody UpdateParticipationDTO updateParticipationDTO) {

            ResponseParticipationDTO updatedParticipation = participationService.update(id, updateParticipationDTO);
            return new ResponseEntity<>(updatedParticipation, HttpStatus.OK);
    }


}
