package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Competition.CreateCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.ResponseCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.UpdateCompetitionDTO;
import com.it.molou3_backend.models.entities.Competition;
import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.models.mappers.CompetitionMapper;
import com.it.molou3_backend.repository.CompetitionRepository;
import com.it.molou3_backend.repository.EtapeCompetitionRepository;
import com.it.molou3_backend.services.interfaces.ICompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@Service
public class CompetitionService extends GenericService<Competition,CreateCompetitionDTO,UpdateCompetitionDTO,ResponseCompetitionDTO> implements ICompetitionService {

    public CompetitionService(CompetitionRepository competitionRepository, CompetitionMapper competitionMapper) {
        super(competitionRepository, competitionMapper);
    }

    @Autowired
    public CompetitionRepository competitionRepository;
    @Autowired
    public CompetitionMapper competitionMapper;
    @Autowired
    public EtapeCompetitionRepository etapeCompetitionRepository;
    @Autowired
    public FileUploadService fileUploadService;



    @Override
    public ResponseCompetitionDTO create(CreateCompetitionDTO createCompetitionDTO) {
        EtapeCompetition etapeCompetition = etapeCompetitionRepository.findById(createCompetitionDTO.getEtapeCompetitionId())
                .orElseThrow(() -> new IllegalArgumentException("L'étape de compétition n'existe pas."));

        Double distance = createCompetitionDTO.getDistance();
        String errorMessage = null;

        switch (etapeCompetition.getTypeEtape()) {
            case VITESSE:
                if (distance < 80 || distance > 300) {
                    errorMessage = "Pour une étape VITESSE, la distance doit être comprise entre 80 et 300 km.";
                }
                break;
            case DEMI_FOND:
                if (distance < 300 || distance > 600) {
                    errorMessage = "Pour une étape DEMI_FOND, la distance doit être comprise entre 300 et 600 km.";
                }
                break;
            case FOND:
                if (distance < 600 || distance > 1200) {
                    errorMessage = "Pour une étape FOND, la distance doit être comprise entre 600 et 1200 km.";
                }
                break;
        }

        if (errorMessage != null) {
            throw new IllegalArgumentException(errorMessage);
        }

        String ville = createCompetitionDTO.getVille();
        Long programmeEditionId = etapeCompetition.getProgrammeEdition().getId();

        boolean villeExists = competitionRepository.existsByVilleAndEtapeCompetition_ProgrammeEdition_Id(ville.toLowerCase(), programmeEditionId);
        if (villeExists) {
            throw new IllegalArgumentException("La ville '" + ville + "' existe déjà dans ce programme édition.");
        }

        Competition competition = competitionMapper.toEntity(createCompetitionDTO);
        return competitionMapper.toDTO(competitionRepository.save(competition));
    }




    @Override
    public ResponseCompetitionDTO update(Long id, UpdateCompetitionDTO updateCompetitionDTO, MultipartFile pdfClassementFile) throws IOException {
        Competition entity = competitionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La compétition avec cet ID n'existe pas."));

        Long newEtapeCompetitionId = updateCompetitionDTO.getEtapeCompetitionId() != null
                ? updateCompetitionDTO.getEtapeCompetitionId()
                : entity.getEtapeCompetition().getId();

        EtapeCompetition newEtapeCompetition = etapeCompetitionRepository.findById(newEtapeCompetitionId)
                .orElseThrow(() -> new IllegalArgumentException("L'étape de compétition n'existe pas."));

        Double newDistance = updateCompetitionDTO.getDistance() != null
                ? updateCompetitionDTO.getDistance()
                : entity.getDistance();
        String newVille = updateCompetitionDTO.getVille() != null
                ? updateCompetitionDTO.getVille()
                : entity.getVille();

        String distanceError = null;
        switch (newEtapeCompetition.getTypeEtape()) {
            case VITESSE:
                if (newDistance < 80 || newDistance > 300) {
                    distanceError = "Pour une étape VITESSE, la distance doit être comprise entre 80 et 300 km.";
                }
                break;
            case DEMI_FOND:
                if (newDistance < 300 || newDistance > 600) {
                    distanceError = "Pour une étape DEMI_FOND, la distance doit être comprise entre 300 et 600 km.";
                }
                break;
            case FOND:
                if (newDistance < 600 || newDistance > 1200) {
                    distanceError = "Pour une étape FOND, la distance doit être comprise entre 600 et 1200 km.";
                }
                break;
        }
        if (distanceError != null) {
            throw new IllegalArgumentException(distanceError);
        }

        Long programmeEditionId = newEtapeCompetition.getProgrammeEdition().getId();
        boolean villeExists = competitionRepository
                .existsByVilleAndEtapeCompetition_ProgrammeEdition_IdAndIdNot(newVille.toLowerCase(), programmeEditionId, entity.getId());
        if (villeExists) {
            throw new IllegalArgumentException("La ville '" + newVille + "' existe déjà dans ce programme édition.");
        }

        Competition updatedEntity = mapper.updateEntityFromDTO(updateCompetitionDTO, entity);
        updatedEntity.setEtapeCompetition(newEtapeCompetition);

        // Gestion du fichier PDF de classement
        if (pdfClassementFile != null && !pdfClassementFile.isEmpty()) {
            String pdfClassementUrl = fileUploadService.uploadFile(pdfClassementFile);
            updatedEntity.setPdfClassement(pdfClassementUrl);
        }

        updatedEntity = competitionRepository.save(updatedEntity);
        return mapper.toDTO(updatedEntity);
    }

    @Override
    public void deleteClassement(Long id) {
        Competition entity = competitionRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("L'étape de compétition avec cet ID n'existe pas.")
        );
        entity.setPdfClassement(null);
        competitionRepository.save(entity);
    }


}
