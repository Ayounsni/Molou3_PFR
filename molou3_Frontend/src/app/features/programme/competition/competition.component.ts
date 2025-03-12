import { Component } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-competition',
  imports: [SidebarComponent],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css'
})
export class CompetitionComponent {
  bg = 'assets/bg8.png'; 


}
