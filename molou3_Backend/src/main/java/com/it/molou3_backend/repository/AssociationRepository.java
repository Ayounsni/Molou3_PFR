package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssociationRepository extends JpaRepository<Association, Long> {
    Optional<Association> findByEmail(String email);
    @Query("SELECT a FROM Association a WHERE " +
            "(:nomAssociation IS NULL OR LOWER(a.nomAssociation) LIKE LOWER(CONCAT('%', :nomAssociation, '%'))) " +
            "AND (:ville IS NULL OR LOWER(a.ville) LIKE LOWER(CONCAT('%', :ville, '%')))")
    List<Association> findByNomAssociationOrVille(@Param("nomAssociation") String nomAssociation,
                                                  @Param("ville") String ville);

}
