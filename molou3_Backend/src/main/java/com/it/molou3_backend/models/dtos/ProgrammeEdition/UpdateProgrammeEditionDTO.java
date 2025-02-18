package com.it.molou3_backend.models.dtos.ProgrammeEdition;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProgrammeEditionDTO {

    private String description;
}
