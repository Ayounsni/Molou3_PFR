package com.it.molou3_backend.models.dtos.Marketplace;

import com.it.molou3_backend.models.dtos.Pigeon.EmbeddablePigeonDTO;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.StatusVente;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMarketplaceDTO {

    private Long id;

    private Double prix;

    private StatusVente statusVente;

    private EmbeddablePigeonDTO pigeon;
}
