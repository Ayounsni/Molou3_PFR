package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.embeddableId.ParticipationId;
import com.it.molou3_backend.models.entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, ParticipationId> {

}
