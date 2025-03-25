import { Component } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-gestion-marketplace',
  imports: [SidebarComponent],
  templateUrl: './gestion-marketplace.component.html',
  styleUrl: './gestion-marketplace.component.css'
})
export class GestionMarketplaceComponent {
  bg = 'assets/bg89.jpg';


}
