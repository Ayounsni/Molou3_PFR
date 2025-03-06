package com.it.molou3_backend.security.services.implementations;


import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.security.config.Jwt.JwtUtils;
import com.it.molou3_backend.security.dtos.AppUserDTO.CreateAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.ResponseAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.UpdateAppUserDTO;
import com.it.molou3_backend.security.dtos.AuthDTO.RequestLoginDTO;
import com.it.molou3_backend.security.dtos.AuthDTO.ResponseLoginDTO;
import com.it.molou3_backend.security.dtos.PasswordDTO.ChangePasswordDTO;
import com.it.molou3_backend.security.entities.AppRole;
import com.it.molou3_backend.security.entities.AppUser;
import com.it.molou3_backend.security.mappers.AppUserMapper;
import com.it.molou3_backend.security.repositories.AppRoleRepository;
import com.it.molou3_backend.security.repositories.AppUserRepository;
import com.it.molou3_backend.security.services.interfaces.IAppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService implements IAppUserService {

    public final AppUserRepository appUserRepository;
    public final AppRoleRepository appRoleRepository;
    public final AppUserMapper appUserMapper;
    public final PasswordEncoder passwordEncoder;
    public final HaveIBeenPwnedService haveIBeenPwnedService;
    public final AuthenticationManager authenticationManager;
    public final JwtUtils jwtUtils;

    @Override
    public ResponseAppUserDTO create(CreateAppUserDTO createAppUserDTO) {

        if (appUserRepository.findByEmail(createAppUserDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cette email existe déjà.");
        }
        if (haveIBeenPwnedService.isPasswordPwned(createAppUserDTO.getPassword())) {
            throw new IllegalArgumentException("Le mot de passe est compromis. Veuillez en choisir un autre.");
        }
        AppUser user = appUserMapper.toEntity(createAppUserDTO);
        user.setPassword(passwordEncoder.encode(createAppUserDTO.getPassword()));
        return appUserMapper.toDTO(appUserRepository.save(user)) ;
    }
    @Override
    public ResponseLoginDTO login(RequestLoginDTO loginRequest) {
        // Authentification de l'utilisateur
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword())
        );

        // Récupération de l'utilisateur depuis la base de données
        AppUser user = appUserRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Création de la réponse DTO
        ResponseLoginDTO response = new ResponseLoginDTO();

        // Remplir les champs communs à tous les utilisateurs
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(authentication.getAuthorities().iterator().next().getAuthority()); // Assurez-vous que `role` est une énumération
        response.setVille(user.getVille());
        response.setTelephone(user.getTelephone());
        response.setPhotoUrl(user.getPhotoUrl());
        response.setAdresse(user.getAdresse());
        response.setDescription(user.getDescription());
        response.setEnabled(user.isEnabled());

        // Générer le token JWT
        String token = jwtUtils.generateToken(user.getEmail());
        response.setToken(token);

        // Vérifier le type de l'utilisateur en utilisant `dtype`
        if ("Colombophile".equals(user.getDtype())) {
            Colombophile colombophile = (Colombophile) user;
            // Remplir les champs spécifiques à Colombophile
            response.setNomComplet(colombophile.getNomComplet());
            response.setNiveauExperience(colombophile.getNiveauExperience());
            response.setDateNaissance(colombophile.getDateNaissance());
        }
        else if ("Association".equals(user.getDtype())) {
            Association association = (Association) user;
            // Remplir les champs spécifiques à Association
            response.setNomAssociation(association.getNomAssociation());
            response.setResponsable(association.getResponsable());
            response.setDateCreation(association.getDateCreation());
            response.setStatusInscription(association.getStatusInscription());
            response.setPreuveLegalePath(association.getPreuveLegalePath());
        }
        else {
            throw new RuntimeException("Type d'utilisateur non pris en charge : " + user.getDtype());
        }

        return response;
    }
    @Override
    public ResponseLoginDTO getCurrentUser(String token) {
        // Extraire l’email du token
        if (!jwtUtils.validateJwtToken(token)) {
            throw new RuntimeException("Token invalide ou expiré");
        }

        // Extraire l’email du token
        String email = jwtUtils.getUsernameFromJwtToken(token);

        // Récupérer l’utilisateur depuis la base de données
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Création de la réponse DTO
        ResponseLoginDTO response = new ResponseLoginDTO();

        // Remplir les champs communs à tous les utilisateurs
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName()); // Assurez-vous que getRole() renvoie un objet avec getAuthority()
        response.setVille(user.getVille());
        response.setTelephone(user.getTelephone());
        response.setPhotoUrl(user.getPhotoUrl());
        response.setAdresse(user.getAdresse());
        response.setDescription(user.getDescription());
        response.setEnabled(user.isEnabled());
        response.setToken(token); // Réutiliser le token existant

        // Vérifier le type de l’utilisateur en utilisant `dtype`
        if ("Colombophile".equals(user.getDtype())) {
            Colombophile colombophile = (Colombophile) user;
            response.setNomComplet(colombophile.getNomComplet());
            response.setNiveauExperience(colombophile.getNiveauExperience());
            response.setDateNaissance(colombophile.getDateNaissance());
        } else if ("Association".equals(user.getDtype())) {
            Association association = (Association) user;
            response.setNomAssociation(association.getNomAssociation());
            response.setResponsable(association.getResponsable());
            response.setDateCreation(association.getDateCreation());
            response.setStatusInscription(association.getStatusInscription());
            response.setPreuveLegalePath(association.getPreuveLegalePath());
        } else {
            throw new RuntimeException("Type d'utilisateur non pris en charge : " + user.getDtype());
        }

        return response;
    }

    @Override
    public List<ResponseAppUserDTO> getAllUsers() {
        List<AppUser> users = appUserRepository.findAll();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userAuth = authentication.getName();
        List<AppUser> newUsers = users.stream().filter(user -> !user.getEmail().equals(userAuth)).toList();
        return newUsers.stream().map(appUserMapper::toDTO).toList();
    }

    @Override
    public void deleteUser(String email){
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userAuth = authentication.getName();
        if(userAuth.equals(email)) {
            throw new IllegalArgumentException("Vous ne pouvez pas supprimer votre propre compte.");
        }
        appUserRepository.delete(user);

    }

    @Override
    public ResponseAppUserDTO updateUser(String email ,UpdateAppUserDTO updateAppUserDTO) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));
        AppRole role = appRoleRepository.findById(updateAppUserDTO.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Ce rôle n'existe pas."));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userAuth = authentication.getName();
        if(userAuth.equals(email)) {
            throw new IllegalArgumentException("Vous ne pouvez pas modifier votre propre rôle.");
        }
        AppUser updatedAppUser = appUserMapper.updateEntityFromDTO(updateAppUserDTO, user);
        updatedAppUser = appUserRepository.save(updatedAppUser);
        return appUserMapper.toDTO(updatedAppUser);
    }


    @Override
    public ResponseAppUserDTO getByUsername(String email) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));

        return appUserMapper.toDTO(user);
    }

    @Override
    public void changePassword(ChangePasswordDTO changePasswordDTO) {
        if(changePasswordDTO.getOldPassword().equals(changePasswordDTO.getNewPassword())) {
            throw new BadCredentialsException("Le nouveau mot de passe ne peut pas être identique à l'ancien mot de passe.");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userAuth = authentication.getName();
        AppUser user = appUserRepository.findByEmail(userAuth)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Ancien mot de passe incorrect");
        }
         user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
         appUserRepository.save(user);
    }
}
