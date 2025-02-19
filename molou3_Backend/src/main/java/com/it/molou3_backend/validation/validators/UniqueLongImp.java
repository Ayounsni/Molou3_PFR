package com.it.molou3_backend.validation.validators;

import com.it.molou3_backend.validation.annotations.UniqueLong;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UniqueLongImp implements ConstraintValidator<UniqueLong, Long> {

    @PersistenceContext
    private EntityManager manager;

    private Class<?> entityClass;
    private String field;

    @Override
    public void initialize(UniqueLong constraintAnnotation) {
        this.entityClass = constraintAnnotation.entity();
        this.field = constraintAnnotation.field();
    }

    @Override
    public boolean isValid(Long value, ConstraintValidatorContext context) {
        if (value == null) {
            // Si la valeur est null, on laisse les autres annotations (ex: @NotNull) la gérer.
            return true;
        }

        // Création de la requête JPQL pour compter les occurrences de la valeur dans le champ spécifié.
        String jpql = "SELECT COUNT(e) FROM " + entityClass.getSimpleName() + " e WHERE e." + field + " = :value";
        TypedQuery<Long> query = manager.createQuery(jpql, Long.class);
        query.setParameter("value", value);
        Long count = query.getSingleResult();
        return count == 0;
    }
}
