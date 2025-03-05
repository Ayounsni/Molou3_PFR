package com.it.molou3_backend.security.dtos.AuthDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseAssociationLoginDTO implements ResponseLogin {
    private String email;
    private String role;
    private String token;
    private String ville;
    private String telephone;
    private String photoUrl;
    private String adresse;
    private String description;
    private boolean enabled;
    private String nomAssociation;
    private String responsable;
    private String dateCreation;
    private String statusInscription;
    private String preuveLegalePath;
}