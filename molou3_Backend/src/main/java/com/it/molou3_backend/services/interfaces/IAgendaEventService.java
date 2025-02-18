package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.AgendaEvent.CreateAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.ResponseAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.UpdateAgendaEventDTO;

public interface IAgendaEventService extends IGenericService<CreateAgendaEventDTO,UpdateAgendaEventDTO,ResponseAgendaEventDTO> {

}
