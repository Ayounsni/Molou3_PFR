package com.it.molou3_backend.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name; // Nom de la catégorie

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE)
    private List<Plate> plates; // Liste des plats associés à la catégorie
}
