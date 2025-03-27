package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {
    @Query("SELECT COUNT(c) > 0 FROM Competition c WHERE LOWER(c.ville) = LOWER(:ville) AND c.etapeCompetition.programmeEdition.id = :programmeEditionId")
    boolean existsByVilleAndEtapeCompetition_ProgrammeEdition_Id(@Param("ville") String ville, @Param("programmeEditionId") Long programmeEditionId);
    @Query("SELECT COUNT(c) > 0 FROM Competition c WHERE LOWER(c.ville) = LOWER(:ville) AND c.etapeCompetition.programmeEdition.id = :programmeEditionId AND c.id <> :id")
    boolean existsByVilleAndEtapeCompetition_ProgrammeEdition_IdAndIdNot(@Param("ville") String ville, @Param("programmeEditionId") Long programmeEditionId, @Param("id") Long id);

}
