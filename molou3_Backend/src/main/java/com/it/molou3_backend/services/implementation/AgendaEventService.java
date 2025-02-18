package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.AgendaEvent.CreateAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.ResponseAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.UpdateAgendaEventDTO;
import com.it.molou3_backend.models.entities.AgendaEvent;
import com.it.molou3_backend.models.mappers.AgendaEventMapper;
import com.it.molou3_backend.repository.AgendaEventRepository;
import com.it.molou3_backend.services.interfaces.IAgendaEventService;
import org.springframework.stereotype.Service;

@Service
public class AgendaEventService extends GenericService<AgendaEvent,CreateAgendaEventDTO,UpdateAgendaEventDTO,ResponseAgendaEventDTO> implements IAgendaEventService {

    public AgendaEventService(AgendaEventRepository agendaEventRepository, AgendaEventMapper agendaEventMapper) {
        super(agendaEventRepository, agendaEventMapper);
    }

}
