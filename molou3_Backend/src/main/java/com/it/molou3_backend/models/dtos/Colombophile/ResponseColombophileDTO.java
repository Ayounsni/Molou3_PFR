package com.it.molou3_backend.models.dtos.Colombophile;

import com.it.molou3_backend.models.dtos.AgendaEvent.EmbeddableAgendaEventDTO;
import com.it.molou3_backend.models.dtos.Pigeon.EmbeddablePigeonDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.EmbeddableProgrammeEditionDTO;
import com.it.molou3_backend.models.enums.NiveauExperience;
import com.it.molou3_backend.security.dtos.AppRoleDTO.EmbeddableAppRoleDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseColombophileDTO {
    private String id;

    private String email;

    private EmbeddableAppRoleDTO role;

    private String photoUrl;

    private String ville ;

    private String adresse;

    private String telephone;

    private String description;

    private String nomComplet;

    private boolean enabled;

    private NiveauExperience niveauExperience;

    private LocalDate dateNaissance;

    private List<EmbeddablePigeonDTO> pigeons;

    private List<EmbeddableAgendaEventDTO> agendaEvents;
}
