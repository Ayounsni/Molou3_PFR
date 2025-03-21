import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-event-modal',
  standalone:false,
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.css']
})
export class AddEventModalComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      start: [data.dateStr, Validators.required],
      color: ['#4caf50']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}