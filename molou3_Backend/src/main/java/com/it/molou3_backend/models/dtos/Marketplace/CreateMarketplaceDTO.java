package com.it.molou3_backend.models.dtos.Marketplace;

import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.entities.Marketplace;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.StatusVente;
import com.it.molou3_backend.validation.annotations.Exists;
import com.it.molou3_backend.validation.annotations.Unique;
import com.it.molou3_backend.validation.annotations.UniqueLong;
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
public class CreateMarketplaceDTO {

    @NotNull
    private Double prix;

    @Enumerated(EnumType.STRING)
    private StatusVente statusVente = StatusVente.DISPONIBLE;

    @NotNull
    @Exists(entity = Pigeon.class, message = "Ce pigeon n'existe pas.")
    @UniqueLong(entity = Marketplace.class, field = "pigeon.id", message = "Ce pigeon est déjà listé dans le marketplace.")
    private Long pigeonId;
}
