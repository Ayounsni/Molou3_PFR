package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.AgendaEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendaEventRepository extends JpaRepository<AgendaEvent, Long> {

}
