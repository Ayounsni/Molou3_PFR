package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.models.enums.TypeEtape;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtapeCompetitionRepository extends JpaRepository<EtapeCompetition, Long> {
    boolean existsByProgrammeEditionIdAndTypeEtape(Long programmeEditionId, TypeEtape typeEtape);

}
