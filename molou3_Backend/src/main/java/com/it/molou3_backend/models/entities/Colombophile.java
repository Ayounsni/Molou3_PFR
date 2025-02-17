package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.models.enums.NiveauExperience;
import com.it.molou3_backend.security.entities.AppUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
public class Colombophile extends AppUser {

    @NotBlank
    private String nomComplet;

    @Enumerated(EnumType.STRING)
    private NiveauExperience niveauExperience;

    private LocalDate dateNaissance;

    @OneToMany(mappedBy = "colombophile", cascade = CascadeType.REMOVE)
    private List<Pigeon> pigeons;

    @OneToMany(mappedBy = "colombophile", cascade = CascadeType.REMOVE)
    private List<AgendaEvent> agendaEvents;
}
