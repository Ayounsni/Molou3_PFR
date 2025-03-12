import { Component } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-etape',
  imports: [SidebarComponent],
  templateUrl: './etape.component.html',
  styleUrl: './etape.component.css'
})
export class EtapeComponent {
  bg = 'assets/bg3.png'; 


}
