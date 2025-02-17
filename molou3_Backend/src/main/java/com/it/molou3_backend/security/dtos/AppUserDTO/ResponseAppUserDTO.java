package com.it.molou3_backend.security.dtos.AppUserDTO;

import com.it.molou3_backend.security.dtos.AppRoleDTO.EmbeddableAppRoleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseAppUserDTO {

    private String id;

    private String email;

    private EmbeddableAppRoleDTO role;
}
