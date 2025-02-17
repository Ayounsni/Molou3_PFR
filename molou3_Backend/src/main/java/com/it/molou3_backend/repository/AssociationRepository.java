package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssociationRepository extends JpaRepository<Association, Long> {
    Optional<Association> findByEmail(String email);

}
