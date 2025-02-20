package com.it.molou3_backend.models.dtos.Competition;

import com.it.molou3_backend.models.dtos.EtapeCompetition.EmbeddableEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.Participation.EmbeddableCompetitionParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.EmbeddablePigeonParticipationDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseCompetitionDTO {

    private Long id;

    private String ville;

    private Double distance;

    private LocalDate competitionDate;

    private LocalDate reunionDate;  // Date du rassemblement des pigeons

    private LocalDateTime reunionHoraire;  // Heure du rassemblement des pigeons

    private String pdfClassement;

    private EmbeddableEtapeCompetitionDTO etapeCompetition;

    private List<EmbeddableCompetitionParticipationDTO> participations;
}
