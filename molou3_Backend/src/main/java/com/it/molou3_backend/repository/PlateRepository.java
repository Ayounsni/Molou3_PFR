package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Plate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlateRepository extends JpaRepository<Plate, Long> {
}
