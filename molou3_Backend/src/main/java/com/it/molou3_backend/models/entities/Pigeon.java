package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pigeon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String serieBague;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private Sexe sexe;

    private LocalDate dateNaissance;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private StatusPigeon statusPigeon;

    @NotNull
    private String nationalite;

    private Boolean estFavori = false;

    @ManyToOne
    private Colombophile colombophile;

    @OneToOne(mappedBy = "pigeon", cascade = CascadeType.REMOVE)
    private Marketplace marketplace;

    @OneToMany(mappedBy = "pigeon", cascade = CascadeType.REMOVE)
    private List<Participation> participations;
}
