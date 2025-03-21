import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin pour la vue grille
import interactionPlugin from '@fullcalendar/interaction'; // Plugin pour les interactions
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AddEventModalComponent } from '../../../shared/components/add-event-modal/add-event-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar',
  standalone:false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarEvents: EventInput[] = [
    { title: "Réunion d'équipe", start: '2025-03-21', color: '#3f51b5' },
    { title: 'Anniversaire', start: '2025-03-20', end: '2025-0-26', color: '#e91e63' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private dialog: MatDialog) {}

  handleDateClick(arg: any) {
    const dialogRef = this.dialog.open(AddEventModalComponent, {
      width: '300px',
      data: { dateStr: arg.dateStr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newEvent: EventInput = {
          title: result.title,
          start: result.start,
          color: result.color
        };
        this.calendarEvents = [...this.calendarEvents, newEvent];
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.addEvent(newEvent);
      }
    });
  }

  handleEventClick(info: any) {
    alert(`Événement: ${info.event.title}`);
  }
}