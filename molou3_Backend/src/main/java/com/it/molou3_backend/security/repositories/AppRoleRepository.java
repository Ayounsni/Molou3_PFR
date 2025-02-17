package com.it.molou3_backend.security.repositories;

import com.it.molou3_backend.security.entities.AppRole;
import com.it.molou3_backend.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppRoleRepository extends JpaRepository<AppRole, Long> {
}
