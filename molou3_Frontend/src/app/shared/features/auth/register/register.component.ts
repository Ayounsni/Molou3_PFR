import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.state';
import { selectError, selectLoading, selectRegisteredUser } from '../../../../store/auth/auth.selectors';
import { Colombophile } from '../../../models/colombophile.model';
import { Association } from '../../../models/association.model';
import { NiveauExperience } from '../../../models/enums/enums';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  currentStep = 1;
  userType: 'colombophile' | 'association' = 'colombophile';
  image = 'assets/molou.png';
  uploadedFiles: { [key: string]: File } = {};
  niveauOptions: NiveauExperience[] = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
  niveauLabels: { [key in NiveauExperience]: string } = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    EXPERT: 'Expert'
  };
  loading$: Observable<boolean>;
  error$: Observable<any>;
  registeredUser$: Observable<Colombophile | Association | null>;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
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
      preuveLegalePath: [''],
      roleId: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.updateValidators();

    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.registeredUser$ = this.store.select(selectRegisteredUser);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  onFileSelected(event: Event, field: string): Promise<void> {
    return new Promise((resolve) => {
      const input = event.target as HTMLInputElement;
      if (input.files?.[0]) {
        this.uploadedFiles[field] = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          if (field === 'photo') {
            this.registerForm.patchValue({ photoUrl: input.files![0].name });
          } else if (field === 'preuveLegale') {
            this.registerForm.patchValue({ preuveLegalePath: input.files![0].name });
          }
          resolve();
        };
        reader.readAsDataURL(input.files[0]);
      } else {
        resolve();
      }
    });
  }

  setUserType(type: 'colombophile' | 'association') {
    this.userType = type;
    this.registerForm.reset();
    this.uploadedFiles = {};
    this.currentStep = 1;
    this.updateValidators();
    this.store.dispatch(AuthActions.resetRegistrationState()); // Réinitialiser l'erreur lors du changement de type
  }

  private updateValidators() {
    const controls = ['responsable', 'dateCreation', 'niveauExperience', 'dateNaissance', 'preuveLegalePath'];
    controls.forEach(control => this.registerForm.get(control)?.clearValidators());

    if (this.userType === 'association') {
      this.registerForm.get('responsable')?.setValidators(Validators.required);
      this.registerForm.get('dateCreation')?.setValidators(Validators.required);
      this.registerForm.get('preuveLegalePath')?.setValidators(Validators.required);
      this.registerForm.get('roleId')?.setValue(1); // Exemple : rôle "association"
    } else {
      this.registerForm.get('niveauExperience')?.setValidators(Validators.required);
      this.registerForm.get('dateNaissance')?.setValidators(Validators.required);
      this.registerForm.get('roleId')?.setValue(2); // Exemple : rôle "colombophile"
    }

    this.registerForm.get('photoUrl')?.setValidators(Validators.required);
    controls.forEach(control => this.registerForm.get(control)?.updateValueAndValidity());
  }

  isCurrentStepValid(): boolean {
    const stepValidations = [
      () => ['email', 'password', 'confirmPassword'],
      () => ['ville', 'adresse', 'telephone'],
      () => this.userType === 'association'
        ? ['nom', 'responsable', 'dateCreation']
        : ['nom', 'niveauExperience', 'dateNaissance'],
      () => this.userType === 'association'
        ? ['photoUrl', 'preuveLegalePath', 'roleId']
        : ['photoUrl', 'roleId']
    ];

    const currentValidation = stepValidations[this.currentStep - 1]();
    return currentValidation.every(field => this.registerForm.get(field)?.valid);
  }

  nextStep() {
    if (this.isCurrentStepValid()) this.currentStep++;
    else this.markGroupTouched(Object.keys(this.registerForm.controls));
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

  async onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const data = this.userType === 'association' ? {
        email: formValue.email,
        password: formValue.password,
        ville: formValue.ville,
        adresse: formValue.adresse,
        telephone: formValue.telephone,
        nomAssociation: formValue.nom,
        responsable: formValue.responsable,
        dateCreation: formValue.dateCreation,
        photoUrl: formValue.photoUrl,
        preuveLegalePath: formValue.preuveLegalePath,
        roleId: formValue.roleId
      } : {
        email: formValue.email,
        password: formValue.password,
        ville: formValue.ville,
        adresse: formValue.adresse,
        telephone: formValue.telephone,
        nomComplet: formValue.nom,
        niveauExperience: formValue.niveauExperience,
        dateNaissance: formValue.dateNaissance,
        photoUrl: formValue.photoUrl,
        roleId: formValue.roleId
      };

      if (this.userType === 'colombophile') {
        this.store.dispatch(AuthActions.registerColombophile({ data }));
      } else {
        this.store.dispatch(AuthActions.registerAssociation({ data }));
      }

      this.registeredUser$.subscribe(user => {
        if (user) {
          this.router.navigate(['/meteo']);
          this.store.dispatch(AuthActions.resetRegistrationState());
        }
      });
    } else {
      this.markGroupTouched(Object.keys(this.registerForm.controls));
    }
  }
}