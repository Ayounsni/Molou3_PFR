package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {
    boolean existsByVilleAndEtapeCompetition_ProgrammeEdition_Id(String ville, Long programmeEditionId);
    boolean existsByVilleAndEtapeCompetition_ProgrammeEdition_IdAndIdNot(String ville, Long programmeEditionId, Long id);

}
