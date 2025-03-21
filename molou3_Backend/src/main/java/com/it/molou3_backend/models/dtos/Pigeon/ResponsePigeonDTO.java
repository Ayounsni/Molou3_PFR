package com.it.molou3_backend.models.dtos.Pigeon;

import com.it.molou3_backend.models.dtos.AgendaEvent.EmbeddableAgendaEventDTO;
import com.it.molou3_backend.models.dtos.Colombophile.EmbeddableColombophileDTO;
import com.it.molou3_backend.models.dtos.Marketplace.EmbeddableMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Participation.EmbeddablePigeonParticipationDTO;
import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponsePigeonDTO {

    private Long id;

    private String serieBague;

    private Sexe sexe;

    private String nationalite;

    private LocalDate dateNaissance;

    private String photoUrl;

    private StatusPigeon statusPigeon;

    private Boolean estFavori = false;

    private EmbeddableColombophileDTO colombophile;

    private EmbeddableMarketplaceDTO Marketplace;

    private List<EmbeddablePigeonParticipationDTO> participations;
}
