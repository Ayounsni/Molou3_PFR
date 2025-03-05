import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectLoginError, selectLoginLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  imagepath = 'assets/logo10.png'; 
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  image = 'assets/molou.png';
  showSuccessMessage = false;
  progressWidth = 100;
  private timer: any;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router,private store: Store<AppState>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkRegistrationSuccess();
    this.store.select(selectLoginError).subscribe(error => {
      this.errorMessage = error;
      this.isLoading = false;
    });
    
    this.store.select(selectLoginLoading).subscribe(loading => {
      this.isLoading = loading;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));
      setTimeout(() => {
        console.log('Login Submitted', this.loginForm.value);
        this.isLoading = false;
      }, 2000);
    }
  }

  private checkRegistrationSuccess() {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.showSuccessMessage = true;
        this.startProgressBar();
        
        // Cleanup URL
        this.router.navigate([], {
          replaceUrl: true,
          queryParams: { registered: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  private startProgressBar() {
    this.progressWidth = 100;
    let width = 100;
    const interval = setInterval(() => {
      width -= 1;
      this.progressWidth = width;
      if (width <= 0) {
        clearInterval(interval);
        this.showSuccessMessage = false;
      }
    }, 40);

    this.timer = setTimeout(() => {
      this.showSuccessMessage = false;
    }, 6000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
