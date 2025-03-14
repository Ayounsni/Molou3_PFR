import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EtapeCompetition } from '../../../../models/etape-competition.model';
import { ProgrammeEdition } from '../../../../models/programme-edition.model';

@Component({
  selector: 'app-etape-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './etape-form.component.html',
  styleUrls: ['./etape-form.component.css']
})
export class EtapeFormComponent {
  @Input() showModal: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() etape: EtapeCompetition | null = null;
  @Input() editions: ProgrammeEdition[] = [];
  @Input() selectedEditionId: number | null = null;
  @Input() errorMessage: string | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitEtape = new EventEmitter<{ data: any, pdfClassementFile?: File }>();

  etapeForm: FormGroup;
  typeEtapeOptions = ['FOND', 'DEMI_FOND', 'VITESSE'];
  pdfClassementFile: File | undefined = undefined;

  constructor(private fb: FormBuilder) {
    this.etapeForm = this.fb.group({
      programmeEditionId: ['', Validators.required],
      typeEtape: ['', Validators.required],
      pdfClassement: [null]
    });
  }

  ngOnChanges(): void {
    if (this.isEditMode && this.etape) {
      this.etapeForm.patchValue({
        programmeEditionId: this.selectedEditionId,
        typeEtape: this.etape.typeEtape,
        pdfClassement: null
      });
    } else if (!this.isEditMode && this.selectedEditionId) {
      this.etapeForm.patchValue({
        programmeEditionId: this.selectedEditionId
      });
    }
    if (!this.showModal) {
      this.etapeForm.reset();
      this.pdfClassementFile = undefined;
    }
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.pdfClassementFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.etapeForm.valid) {
      const etapeData = {
        programmeEditionId: Number(this.etapeForm.value.programmeEditionId),
        typeEtape: this.etapeForm.value.typeEtape
      };
      this.submitEtape.emit({ data: etapeData, pdfClassementFile: this.pdfClassementFile });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}