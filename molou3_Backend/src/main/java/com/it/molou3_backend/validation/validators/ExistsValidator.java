package com.it.molou3_backend.validation.validators;


import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ExistsValidator implements ConstraintValidator<Exists, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    private Class<?> entityClass;

    @Override
    public void initialize(Exists constraintAnnotation) {
        this.entityClass = constraintAnnotation.entity();
    }

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext context) {
        if (id == null) {
            return true;
        }

        String jpql = "SELECT COUNT(e) FROM " + entityClass.getSimpleName() + " e WHERE e.id = :id";
        TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class);
        query.setParameter("id", id);

        Long count = query.getSingleResult();
        return count > 0;
    }
}

