import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from "../../../components/footer/footer.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  currentStep = 1;
  isLoading = false;
  userType: 'colombophile' | 'association' = 'colombophile';
  image = 'assets/molou.png';

  // Options pour le niveau d'expérience (pour Colombophile)
  niveauOptions = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Formulaire regroupant tous les champs
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      // STEP 1: Identification
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],

      // STEP 2: Coordonnées
      ville: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^(\\+212|0)[5-7][0-9]{8}$')]],

      // STEP 3: Informations personnelles
      // Utilisation d'un même champ "nom" pour "nomAssociation" ou "nomComplet"
      nom: ['', Validators.required],
      // Pour Association uniquement :
      responsable: [''],
      dateCreation: [''],
      // Pour Colombophile uniquement :
      niveauExperience: [''],
      dateNaissance: [''],

      // STEP 4: Documents et Photo
      photoUrl: [''],
      // Pour Association uniquement :
      preuveLegalePath: [''],
      documentAdditionnel: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // Validateur personnalisé pour vérifier que les deux mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const pwd = control.get('password')?.value;
    const cpwd = control.get('confirmPassword')?.value;
    return pwd && cpwd && pwd !== cpwd ? { mismatch: true } : null;
  }

  // Permet de choisir le type d'utilisateur et de réinitialiser les champs spécifiques
  setUserType(type: 'colombophile' | 'association'): void {
    this.userType = type;
    if (type === 'colombophile') {
      this.registerForm.patchValue({
        responsable: '',
        dateCreation: '',
        preuveLegalePath: '',
        documentAdditionnel: ''
      });
    }
    this.currentStep = 1;
  }



  // Navigation entre les étapes en validant les champs de la partie en cours
  nextStep(): void {
    if (this.currentStep === 1) {
      if (
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('password')?.valid &&
        this.registerForm.get('confirmPassword')?.valid
      ) {
        this.currentStep = 2;
      } else {
        this.markGroupTouched(['email', 'password', 'confirmPassword']);
      }
    } else if (this.currentStep === 2) {
      if (
        this.registerForm.get('ville')?.valid &&
        this.registerForm.get('adresse')?.valid &&
        this.registerForm.get('telephone')?.valid
      ) {
        this.currentStep = 3;
      } else {
        this.markGroupTouched(['ville', 'adresse', 'telephone']);
      }
    } else if (this.currentStep === 3) {
      if (this.userType === 'association') {
        if (
          this.registerForm.get('nom')?.valid &&
          this.registerForm.get('responsable')?.value &&
          this.registerForm.get('dateCreation')?.value
        ) {
          this.currentStep = 4;
        } else {
          this.markGroupTouched(['nom', 'responsable', 'dateCreation']);
        }
      } else {
        if (
          this.registerForm.get('nom')?.valid &&
          this.registerForm.get('niveauExperience')?.value &&
          this.registerForm.get('dateNaissance')?.value
        ) {
          this.currentStep = 4;
        } else {
          this.markGroupTouched(['nom', 'niveauExperience', 'dateNaissance']);
        }
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }

  markGroupTouched(fields: string[]): void {
    fields.forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        console.log('Form Submitted', this.registerForm.value);
        this.isLoading = false;
      }, 2000);
    }
  }
}