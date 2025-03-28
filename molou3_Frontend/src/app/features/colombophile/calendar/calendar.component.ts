import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Store } from '@ngrx/store';
import { AgendaEventService } from '../../../core/services/agenda-event.service';
import { NotificationService } from '../../../core/services/notification.service'; 
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  bg = 'assets/cal3.jpg';
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
  showDeleteModal = false;
  selectedEvent: any = null;
  currentUser: any = null;
  selectedDate: string = '';
  errorMessage: string | null = null;
  eventIdToDelete: number | null = null;

  private getEventColor(typeEvent: string): string {
    switch (typeEvent) {
      case 'NETTOYAGE':
        return '#059669'; 
      case 'COMPETITION':
        return '#4f46e5'; 
      case 'ENTRAINEMENT':
        return '#0284c7'; 
      case 'SOIN':
        return '#d97706'; 
      default:
        return '#6b7280'; 
    }
  }

  constructor(
    private agendaEventService: AgendaEventService,
    private notificationService: NotificationService,
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
    if (this.currentUser && this.currentUser.id) {
      this.agendaEventService.getAllAgendaEvents().subscribe({
        next: (events) => {
          const userEvents = events.filter(event => 
            String(event.colombophile?.id) === String(this.currentUser!.id)
          );
  
          this.calendarEvents = userEvents.map(event => ({
            id: event.id?.toString(),
            title: event.typeEvent,
            start: event.dateDebut,
            end: event.dateFin,
            backgroundColor: this.getEventColor(event.typeEvent),
            borderColor: this.getEventColor(event.typeEvent),
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
    } else {
      console.error('Utilisateur actuel non défini');
    }
  }

  handleDateClick(arg: any): void {
    this.selectedDate = arg.dateStr;
    this.showAddModal = true;
    this.errorMessage = null;
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
          backgroundColor: this.getEventColor(newEvent.typeEvent),
          borderColor: this.getEventColor(newEvent.typeEvent),
          extendedProps: {
            description: newEvent.description,
            typeEvent: newEvent.typeEvent,
            colombophileId: newEvent.colombophile?.id
          }
        };
        this.calendarEvents.push(eventToAdd);
        this.calendarComponent.getApi().addEvent(eventToAdd);
        this.showAddModal = false;
        this.errorMessage = null;
        this.notificationService.showNotification('Événement ajouté avec succès', 'success'); 
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showDetailModal = false;
    this.selectedEvent = null;
    this.errorMessage = null;
  }

  deleteEvent(eventId: number): void {
    this.eventIdToDelete = eventId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.eventIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.eventIdToDelete !== null) {
      this.agendaEventService.deleteAgendaEvent(this.eventIdToDelete).subscribe({
        next: () => {
          const event = this.calendarComponent.getApi().getEventById(this.eventIdToDelete!.toString());
          if (event) event.remove();
          this.calendarEvents = this.calendarEvents.filter(e => e.id !== this.eventIdToDelete!.toString());
          this.showDeleteModal = false;
          this.showDetailModal = false;
          this.eventIdToDelete = null;
          this.notificationService.showNotification('Événement supprimé avec succès', 'success'); 
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          this.errorMessage = error;
          this.showDeleteModal = false;
        }
      });
    }
  }
}