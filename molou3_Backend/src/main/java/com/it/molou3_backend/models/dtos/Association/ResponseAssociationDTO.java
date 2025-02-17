package com.it.molou3_backend.models.dtos.Association;

import com.it.molou3_backend.models.enums.StatusInscription;
import com.it.molou3_backend.security.dtos.AppRoleDTO.EmbeddableAppRoleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseAssociationDTO {
    private String id;

    private String email;

    private EmbeddableAppRoleDTO role;

    private String nomAssociation;

    private String responsable;

    private LocalDate dateCreation;

    private StatusInscription statusInscription;

    private String preuveLegalePath;


}
