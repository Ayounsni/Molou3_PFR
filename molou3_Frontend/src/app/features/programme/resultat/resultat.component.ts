import { Component } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-resultat',
  imports: [SidebarComponent],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.css'
})
export class ResultatComponent {
  bg = 'assets/bg7.png'; 

}
