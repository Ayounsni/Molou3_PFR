package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.models.enums.TypeEtape;
import jakarta.persistence.*;
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
public class EtapeCompetition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TypeEtape typeEtape;

    @NotNull
    private Double valeurMin;

    @NotNull
    private Double valeurMax;

    private String pdfClassement;

    @ManyToOne
    private ProgrammeEdition programmeEdition;

    @OneToMany(mappedBy = "etapeCompetition", cascade = CascadeType.REMOVE)
    private List<Competition> competitions;


}
