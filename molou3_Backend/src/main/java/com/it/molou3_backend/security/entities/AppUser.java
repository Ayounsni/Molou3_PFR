package com.it.molou3_backend.security.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @NotBlank
    private String password;

    private String photoUrl;

    @NotBlank
    private String ville ;

    private String adresse;

    @NotBlank
    private String telephone;

    private String description;

    private boolean enabled = true;

    @Column(name = "dtype", insertable = false, updatable = false)
    private String dtype; //

    @ManyToOne
    private AppRole role;

}


