package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Category;
import com.it.molou3_backend.models.entities.Colombophile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColombophileRepository extends JpaRepository<Colombophile, Long> {
}
