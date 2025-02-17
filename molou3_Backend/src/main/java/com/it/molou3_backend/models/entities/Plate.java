package com.it.molou3_backend.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Plate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name; // Nom du plat

    private String description; // Description du plat

    @NotNull
    private int price;

    private boolean available;

    @ManyToOne
    private Category category; // Relation avec la catégorie du plat
}
