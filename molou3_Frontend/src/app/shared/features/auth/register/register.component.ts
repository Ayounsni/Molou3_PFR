import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  currentStep = 1;
  isLoading = false;
  userType: 'colombophile' | 'association' = 'colombophile';
  image = 'assets/molou.png';
  uploadedFiles: { [key: string]: File } = {};
  niveauOptions = ['Débutant', 'Intermédiaire', 'Avancé'];

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      ville: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^(\\+212|0)[5-7][0-9]{8}$')]],
      nom: ['', Validators.required],
      responsable: [''],
      dateCreation: [''],
      niveauExperience: [''],
      dateNaissance: [''],
      photoUrl: ['', Validators.required],
      preuveLegalePath: ['']
    }, { validators: this.passwordMatchValidator });

    this.updateValidators(); // Appliquer les validateurs initiaux
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  onFileSelected(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.uploadedFiles[field] = input.files[0];
      if (field === 'photo') {
        const reader = new FileReader();
        reader.onload = (e) => this.registerForm.patchValue({ photoUrl: e.target?.result });
        reader.readAsDataURL(input.files[0]);
      } else if (field === 'preuveLegale') {
        this.registerForm.patchValue({ preuveLegalePath: input.files[0].name });
      }
    }
  }

  setUserType(type: 'colombophile' | 'association') {
    this.userType = type;
    this.registerForm.reset();
    this.uploadedFiles = {};
    this.currentStep = 1;
    this.updateValidators();
  }

  private updateValidators() {
    const controls = ['responsable', 'dateCreation', 'niveauExperience', 'dateNaissance'];
    controls.forEach(control => this.registerForm.get(control)?.clearValidators());

    if (this.userType === 'association') {
      this.registerForm.get('responsable')?.setValidators(Validators.required);
      this.registerForm.get('dateCreation')?.setValidators(Validators.required);
      this.registerForm.get('preuveLegalePath')?.setValidators(Validators.required);
    } else {
      this.registerForm.get('niveauExperience')?.setValidators(Validators.required);
      this.registerForm.get('dateNaissance')?.setValidators(Validators.required);
    }

    controls.forEach(control => this.registerForm.get(control)?.updateValueAndValidity());
  }

  nextStep() {
    const stepValidations = [
      () => ['email', 'password', 'confirmPassword'],
      () => ['ville', 'adresse', 'telephone'],
      () => this.userType === 'association'
        ? ['nom', 'responsable', 'dateCreation']
        : ['nom', 'niveauExperience', 'dateNaissance'],
      () => this.userType === 'association'
        ? ['photoUrl', 'preuveLegalePath']
        : ['photoUrl']
    ];

    const currentValidation = stepValidations[this.currentStep - 1]();
    const isValid = currentValidation.every(field => this.registerForm.get(field)?.valid);

    isValid ? this.currentStep++ : this.markGroupTouched(currentValidation);
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number) {
    if (step <= this.currentStep) this.currentStep = step;
  }

  markGroupTouched(fields: string[]) {
    fields.forEach(field => this.registerForm.get(field)?.markAsTouched());
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        console.log('Form Submitted', this.registerForm.value);
        this.isLoading = false;
      }, 2000);
    } else {
      this.markGroupTouched(Object.keys(this.registerForm.controls));
    }
  }
}