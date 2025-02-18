package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.repository.EtapeCompetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EtapeCompetitionMapperHelper {

    @Autowired
    private EtapeCompetitionRepository etapeCompetitionRepository;

    public EtapeCompetition mapEtapeCompetitionIdToEtapeCompetition(Long etapeCompetitionId) {
        return etapeCompetitionRepository.findById(etapeCompetitionId).orElse(null);
    }
}
