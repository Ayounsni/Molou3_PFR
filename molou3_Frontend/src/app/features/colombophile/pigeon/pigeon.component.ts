import { Component } from '@angular/core';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-pigeon',
  imports: [NotificationComponent, SidebarComponent],
  templateUrl: './pigeon.component.html',
  styleUrl: './pigeon.component.css'
})
export class PigeonComponent {
  bg = 'assets/bg100.jpg';
}
