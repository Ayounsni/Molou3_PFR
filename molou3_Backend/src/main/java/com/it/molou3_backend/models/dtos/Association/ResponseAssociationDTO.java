package com.it.molou3_backend.models.dtos.Association;

import com.it.molou3_backend.models.dtos.Annonce.EmbeddableAnnonceDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.EmbeddableProgrammeEditionDTO;
import com.it.molou3_backend.models.enums.StatusInscription;
import com.it.molou3_backend.security.dtos.AppRoleDTO.EmbeddableAppRoleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseAssociationDTO {
    private String id;

    private String email;

    private EmbeddableAppRoleDTO role;

    private String photoUrl;

    private String ville ;

    private String adresse;

    private String telephone;

    private String description;

    private String nomAssociation;

    private String responsable;

    private LocalDate dateCreation;

    private StatusInscription statusInscription;

    private String preuveLegalePath;

    private Boolean enabled;

    private List<EmbeddableAnnonceDTO> annonces;

    private List<EmbeddableProgrammeEditionDTO> programmeEditions;


}
