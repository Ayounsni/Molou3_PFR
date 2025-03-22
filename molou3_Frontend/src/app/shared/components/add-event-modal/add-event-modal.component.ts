import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-event-modal',
  standalone: false,
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.css']
})
export class AddEventModalComponent implements OnInit {
  @Input() dateStr!: string;
  @Input() currentUser: any = null;
  @Input() errorMessage: string | null = null; // Reçu du parent
  @Output() saveEvent = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  eventForm: FormGroup;
  typeEventOptions: string[] = ['COMPETITION', 'SOIN', 'ENTRAINEMENT', 'NETTOYAGE'];

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      typeEvent: ['', Validators.required],
      colombophileId: [null, Validators.required]
    });
  }

  ngOnInit() {
    if (this.currentUser) {
      this.eventForm.patchValue({
        dateDebut: this.dateStr,
        colombophileId: this.currentUser.id
      });
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.saveEvent.emit(this.eventForm.value); // Émet les données au parent
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis.'; // Erreur locale
    }
    // Ne ferme pas le modal ici
  }

  closePigeonModal() {
    this.closeModal.emit(); // Ferme le modal uniquement via le bouton "Annuler" ou succès
  }
}