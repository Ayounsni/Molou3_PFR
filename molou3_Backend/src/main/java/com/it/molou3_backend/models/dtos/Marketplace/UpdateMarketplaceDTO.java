package com.it.molou3_backend.models.dtos.Marketplace;

import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.StatusVente;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMarketplaceDTO {

    private Double prix;

    @Enumerated(EnumType.STRING)
    private StatusVente statusVente;

    @Exists(entity = Pigeon.class, message = "Ce pigeon n'existe pas.")
    private Long pigeonId;
}
