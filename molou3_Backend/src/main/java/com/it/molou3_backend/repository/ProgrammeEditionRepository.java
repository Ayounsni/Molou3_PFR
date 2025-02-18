package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.ProgrammeEdition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammeEditionRepository extends JpaRepository<ProgrammeEdition, Long> {
    List<ProgrammeEdition> findAllByAssociationId(Long id);
}
