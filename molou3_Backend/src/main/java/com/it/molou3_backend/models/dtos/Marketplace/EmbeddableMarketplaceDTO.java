package com.it.molou3_backend.models.dtos.Marketplace;

import com.it.molou3_backend.models.enums.StatusVente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableMarketplaceDTO {

    private Long id;

    private Double prix;

    private StatusVente statusVente;
}
