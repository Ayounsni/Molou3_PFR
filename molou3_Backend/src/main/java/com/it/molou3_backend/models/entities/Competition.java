package com.it.molou3_backend.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String ville;

    @NotNull
    @Column(nullable = false)
    private Double distance;

    @NotNull
    private LocalDate reunionDate;  // Date du rassemblement des pigeons


    private LocalDateTime reunionHoraire;  // Heure du rassemblement des pigeons

    private String pdfClassement;

    @ManyToOne
    private EtapeCompetition etapeCompetition;

    @OneToMany(mappedBy = "competition", cascade = CascadeType.REMOVE)
    private List<Participation> participations;


}
