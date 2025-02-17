package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.repository.ColombophileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ColombophileMapperHelper {

    @Autowired
    private ColombophileRepository colombophileRepository;

    public Colombophile mapColombophileIdToColombophile(Long colombophileId) {
        return colombophileRepository.findById(colombophileId).orElse(null);
    }
}
