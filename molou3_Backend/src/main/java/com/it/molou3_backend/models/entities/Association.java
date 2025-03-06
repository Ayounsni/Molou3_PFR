package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.models.enums.StatusInscription;
import com.it.molou3_backend.security.entities.AppUser;
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
@DiscriminatorValue("Association")
public class Association extends AppUser {

    @NotBlank
    private String nomAssociation;

    @NotBlank
    private String responsable;

    @NotNull
    private LocalDate dateCreation;

    @Enumerated(EnumType.STRING)
    private StatusInscription statusInscription;

    @NotBlank
    private String preuveLegalePath;

    @OneToMany(mappedBy = "association", cascade = CascadeType.REMOVE)
    private List<Annonce> annonces;

    @OneToMany(mappedBy = "association", cascade = CascadeType.REMOVE)
    private List<ProgrammeEdition> programmeEditions;
}
