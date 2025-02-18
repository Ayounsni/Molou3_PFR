package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.AgendaEvent.CreateAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.ResponseAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.UpdateAgendaEventDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.AgendaEvent;
import com.it.molou3_backend.services.implementation.AgendaEventService;
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
@RequestMapping("/api/public/agendaEvent")
public class AgendaEventController {
    @Autowired
    private AgendaEventService agendaEventService;

    @PostMapping
    public ResponseEntity<ResponseAgendaEventDTO> createAgendaEvent(@Valid @RequestBody CreateAgendaEventDTO createAgendaEventDTO) {
        ResponseAgendaEventDTO agendaEvent = agendaEventService.create(createAgendaEventDTO);
        return new ResponseEntity<>(agendaEvent, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseAgendaEventDTO> getAgendaEventById(@Exists(entity = AgendaEvent.class , message = "Cette agendaEvent n'existe pas.")  @PathVariable("id") Long id) {
            ResponseAgendaEventDTO agendaEvent = agendaEventService.findById(id);
            return new ResponseEntity<>(agendaEvent, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseAgendaEventDTO>> getAllAgendaEventsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseAgendaEventDTO> agendaEvents = agendaEventService.findAll(page, size);
        return new ResponseEntity<>(agendaEvents, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseAgendaEventDTO>> getAllAgendaEvents() {
        List<ResponseAgendaEventDTO> agendaEvents = agendaEventService.findAll();
        return new ResponseEntity<>(agendaEvents, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAgendaEvent(@Exists(entity = AgendaEvent.class , message = "Cette agendaEvent n'existe pas.") @PathVariable("id") Long id) {
            agendaEventService.deleteById(id);
            return new ResponseEntity<>("AgendaEvent est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseAgendaEventDTO> updateAgendaEvent(@Exists(entity = AgendaEvent.class , message = "Cette agendaEvent n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdateAgendaEventDTO updateAgendaEventDTO) {

            ResponseAgendaEventDTO updatedAgendaEvent = agendaEventService.update(id, updateAgendaEventDTO);
            return new ResponseEntity<>(updatedAgendaEvent, HttpStatus.OK);
    }


}
