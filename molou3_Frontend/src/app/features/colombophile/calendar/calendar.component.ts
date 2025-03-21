import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Store } from '@ngrx/store';
import { AgendaEventService } from '../../../core/services/agenda-event.service';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';


@Component({
  selector: 'app-calendar',
  standalone:false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  bg = 'assets/bg108.jpg';
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarEvents: EventInput[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  showAddModal = false;
  showDetailModal = false;
  selectedEvent: any = null;
  currentUser: any = null;
  selectedDate: string = '';

  constructor(
    private agendaEventService: AgendaEventService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadEvents();
  }

  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });
  }

  loadEvents(): void {
    this.agendaEventService.getAllAgendaEvents().subscribe({
      next: (events) => {
        this.calendarEvents = events.map(event => ({
          id: event.id?.toString(),
          title: event.typeEvent,
          start: event.dateDebut,
          end: event.dateFin,
          extendedProps: {
            description: event.description,
            typeEvent: event.typeEvent,
            colombophileId: event.colombophile?.id
          }
        }));
        this.calendarOptions.events = this.calendarEvents;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements', error);
      }
    });
  }

  handleDateClick(arg: any): void {
    this.selectedDate = arg.dateStr;
    this.showAddModal = true;
  }

  handleEventClick(info: any): void {
    this.selectedEvent = {
      id: info.event.id,
      description: info.event.extendedProps.description,
      dateDebut: info.event.startStr,
      dateFin: info.event.endStr,
      typeEvent: info.event.extendedProps.typeEvent,
      colombophileId: info.event.extendedProps.colombophileId
    };
    this.showDetailModal = true;
  }

  saveEvent(eventData: any): void {
    this.agendaEventService.createAgendaEvent(eventData).subscribe({
      next: (newEvent) => {
        const eventToAdd: EventInput = {
          id: newEvent.id?.toString(),
          title: newEvent.typeEvent,
          start: newEvent.dateDebut,
          end: newEvent.dateFin,
          extendedProps: {
            description: newEvent.description,
            typeEvent: newEvent.typeEvent,
            colombophileId: newEvent.colombophile?.id
          }
        };
        this.calendarEvents.push(eventToAdd);
        this.calendarComponent.getApi().addEvent(eventToAdd);
        this.showAddModal = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'événement', error);
      }
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showDetailModal = false;
    this.selectedEvent = null;
  }
}