import { Component } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-edition',
  imports: [SidebarComponent],
  templateUrl: './edition.component.html',
  styleUrl: './edition.component.css'
})
export class EditionComponent {
  bg = 'assets/bg5.png'; 


}
