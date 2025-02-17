package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.models.enums.StatusVente;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Marketplace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Double prix;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private StatusVente statusVente;

    @OneToOne
    private Pigeon pigeon;
}
