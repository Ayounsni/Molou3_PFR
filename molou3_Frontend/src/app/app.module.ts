import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './features/colombophile/calendar/calendar.component'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEventModalComponent } from './shared/components/add-event-modal/add-event-modal.component';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { NotificationComponent } from "./shared/components/notification/notification.component";
import { EventDetailModalComponent } from './shared/components/event-detail-modal/event-detail-modal.component';
import { DeleteConfirmationModalComponent } from "./shared/components/delete-confirmation-modal/delete-confirmation-modal.component";

@NgModule({
  declarations: [
    CalendarComponent,
    AddEventModalComponent,
    EventDetailModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    FullCalendarModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule, 
    ReactiveFormsModule 
    ,
    SidebarComponent,
    NotificationComponent,
    DeleteConfirmationModalComponent
],
  exports: [CalendarComponent] 
})
export class AppModule {}