package com.it.molou3_backend.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgrammeEdition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Integer annee;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    private Association association;

    @OneToMany(mappedBy = "programmeEdition", cascade = CascadeType.REMOVE)
    private List<EtapeCompetition> etapeCompetitions;
}
