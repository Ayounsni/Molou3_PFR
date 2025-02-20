package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.Competition;
import com.it.molou3_backend.repository.CompetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CompetitionMapperHelper {

    @Autowired
    private CompetitionRepository competitionRepository;

    public Competition mapCompetitionIdToCompetition(Long competitionId) {
        return competitionRepository.findById(competitionId).orElse(null);
    }
}
