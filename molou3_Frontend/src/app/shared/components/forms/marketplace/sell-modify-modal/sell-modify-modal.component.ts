import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pigeon } from '../../../../models/pigeon.model';
import { Marketplace } from '../../../../models/marketplace.model';


@Component({
  selector: 'app-sell-modify-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sell-modify-modal.component.html',
  styleUrls: ['./sell-modify-modal.component.css']
})
export class SellModifyModalComponent {
  @Input() showModal: boolean = false;
  @Input() title: string = 'Vendre un pigeon';
  @Input() pigeon: Pigeon | null = null;
  @Input() marketplace: Marketplace | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submit = new EventEmitter<number>();

  sellPrice: number | null = null;
  errorMessage: string | null = null;

  ngOnChanges(): void {
    if (this.showModal && this.marketplace) {
      this.sellPrice = this.marketplace.prix; 
    } else {
      this.sellPrice = null; 
      this.errorMessage = null;
    }
  }

  close(): void {
    this.closeModal.emit();
    this.sellPrice = null;
    this.errorMessage = null;
  }

  submitAction(): void {
    if (this.sellPrice === null || this.sellPrice <= 0) {
      this.errorMessage = 'Le prix doit être supérieur à 0.';
      return;
    }
    this.submit.emit(this.sellPrice);
    this.close();
  }
}