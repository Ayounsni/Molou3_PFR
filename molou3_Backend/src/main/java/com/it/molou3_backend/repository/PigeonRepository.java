package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.entities.Pigeon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PigeonRepository extends JpaRepository<Pigeon, Long> {
    Page<Pigeon> findByColombophileId(Long colombophileId, Pageable pageable);


}
