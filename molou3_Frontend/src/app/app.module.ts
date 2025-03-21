import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Pour les animations Material
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './features/colombophile/calendar/calendar.component'; // Chemin de ton composant
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEventModalComponent } from './shared/components/add-event-modal/add-event-modal.component';

@NgModule({
  declarations: [
    CalendarComponent,
    AddEventModalComponent// Ajoute ton composant modal ici
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Nécessaire pour Angular Material
    FullCalendarModule,
    MatDialogModule, // Pour le dialog
    MatFormFieldModule, // Pour mat-form-field
    MatInputModule, // Pour matInput
    MatButtonModule, // Pour mat-button
    ReactiveFormsModule // Pour les formulaires réactifs
  ],
  exports: [CalendarComponent] // Exporte si utilisé ailleurs
})
export class AppModule {}