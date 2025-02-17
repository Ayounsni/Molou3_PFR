package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.models.enums.TypeEvent;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgendaEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateDebut;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private TypeEvent typeEvent;

    @ManyToOne
    private Colombophile colombophile;
}
