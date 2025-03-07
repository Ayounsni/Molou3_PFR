package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.security.entities.AppUser;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Admin")
public class Admin extends AppUser {
    // Aucune propriété supplémentaire, juste pour éviter les erreurs Hibernate
}

