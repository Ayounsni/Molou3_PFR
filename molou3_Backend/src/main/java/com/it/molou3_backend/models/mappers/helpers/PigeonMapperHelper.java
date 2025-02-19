package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.repository.PigeonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PigeonMapperHelper {

    @Autowired
    private PigeonRepository pigeonRepository;

    public Pigeon mapPigeonIdToPigeon(Long pigeonId) {
        return pigeonRepository.findById(pigeonId).orElse(null);
    }
}
