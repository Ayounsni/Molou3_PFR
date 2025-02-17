package com.it.molou3_backend.models.entities;

import com.it.molou3_backend.security.entities.AppUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String message;

    @NotNull
    private LocalDateTime dateEnvoi;

    @NotNull
    private Boolean estLue = false;

    @ManyToOne
    private AppUser appUser;

}
