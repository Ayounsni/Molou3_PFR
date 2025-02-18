package com.it.molou3_backend.models.dtos.ProgrammeEdition;
import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProgrammeEditionDTO {

    @NotNull
    @Min(value = 2000, message = "L'année ne peut pas être antérieure à 2010.")
    @Max(value = 2100, message = "L'année ne peut pas dépasser 2050.")
    private Integer annee;

    private String description;

    @NotNull
    @Exists(entity = Association.class, message = "Cette association n'existe pas.")
    private Long associationId;
}
