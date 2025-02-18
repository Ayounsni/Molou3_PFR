package com.it.molou3_backend.models.dtos.Annonce;

import com.it.molou3_backend.models.dtos.Association.EmbeddableAssociationDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableAnnonceDTO {

    private Long id;

    private String titre;

    private String contenu;

    private LocalDateTime datePublication;

}
