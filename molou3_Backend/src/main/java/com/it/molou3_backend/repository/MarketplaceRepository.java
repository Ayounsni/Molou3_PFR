package com.it.molou3_backend.repository;

import com.it.molou3_backend.models.dtos.Marketplace.ResponseMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Marketplace;
import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusVente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketplaceRepository extends JpaRepository<Marketplace, Long> {
    @Query("SELECT m FROM Marketplace m " +
            "WHERE (:status IS NULL OR m.statusVente = :status) " +
            "AND (LOWER(TRIM(:ville)) IS NULL OR LOWER(TRIM(m.pigeon.colombophile.ville)) LIKE LOWER(CONCAT('%', TRIM(:ville), '%'))) " + // Recherche partielle pour la ville
            "AND (LOWER(TRIM(:nationalite)) IS NULL OR LOWER(TRIM(m.pigeon.nationalite)) LIKE LOWER(CONCAT('%', TRIM(:nationalite), '%'))) " + // Recherche partielle pour la nationalité
            "AND (:sexe IS NULL OR m.pigeon.sexe = :sexe) " +
            "AND (:prixMin IS NULL OR m.prix >= :prixMin) " +
            "AND (:prixMax IS NULL OR m.prix <= :prixMax)")
    Page<Marketplace> findByFilters(
            @Param("status") StatusVente status,
            @Param("ville") String ville,
            @Param("nationalite") String nationalite,
            @Param("sexe") Sexe sexe,
            @Param("prixMin") Double prixMin,
            @Param("prixMax") Double prixMax,
            Pageable pageable);
    }
