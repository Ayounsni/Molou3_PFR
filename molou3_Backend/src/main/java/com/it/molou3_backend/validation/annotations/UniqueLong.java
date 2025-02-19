package com.it.molou3_backend.validation.annotations;

import com.it.molou3_backend.validation.validators.UniqueLongImp;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UniqueLongImp.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD})
public @interface UniqueLong {
    String message() default "Cette valeur est déjà utilisée.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    // Spécifie la classe de l'entité dans laquelle vérifier l'unicité.
    Class<?> entity();

    // Le nom du champ dans l'entité à vérifier.
    String field();
}
