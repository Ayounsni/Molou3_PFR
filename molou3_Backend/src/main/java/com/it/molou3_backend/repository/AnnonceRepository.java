package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
    Page<Annonce> findByAssociationId(Long associationId, Pageable pageable);


}
