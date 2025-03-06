package com.it.molou3_backend.security.services.interfaces;

import com.it.molou3_backend.security.dtos.AppUserDTO.CreateAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.ResponseAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.UpdateAppUserDTO;
import com.it.molou3_backend.security.dtos.AuthDTO.RequestLoginDTO;
import com.it.molou3_backend.security.dtos.AuthDTO.ResponseLoginDTO;
import com.it.molou3_backend.security.dtos.PasswordDTO.ChangePasswordDTO;

import java.util.List;

public interface IAppUserService {
    ResponseAppUserDTO create(CreateAppUserDTO user);
    ResponseAppUserDTO getByUsername(String username);
    List<ResponseAppUserDTO> getAllUsers();
    void deleteUser(String username);
    ResponseAppUserDTO updateUser(String username , UpdateAppUserDTO updateAppUserDTO);
    void changePassword(ChangePasswordDTO changePasswordDTO);
    ResponseLoginDTO login(RequestLoginDTO loginRequest);
    public ResponseLoginDTO getCurrentUser(String token);

}
