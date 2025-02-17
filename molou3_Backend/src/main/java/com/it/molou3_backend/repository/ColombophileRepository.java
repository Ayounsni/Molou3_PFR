package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.entities.Category;
import com.it.molou3_backend.models.entities.Colombophile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColombophileRepository extends JpaRepository<Colombophile, Long> {
    Optional<Colombophile> findByEmail(String email);

}
