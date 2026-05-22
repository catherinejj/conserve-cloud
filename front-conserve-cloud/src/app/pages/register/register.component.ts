import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { AuthApiService } from '../../features/auth/services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);

  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  readonly today = new Date().toISOString().split('T')[0];

  constructor() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get firstName() { return this.form.get('firstName')!; }
  get lastName()  { return this.form.get('lastName')!; }
  get birthDate() { return this.form.get('birthDate')!; }
  get email()     { return this.form.get('email')!; }
  get password()  { return this.form.get('password')!; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const { firstName, lastName, birthDate, email, password } = this.form.value;
    this.authApi.register(firstName, lastName, birthDate, email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message ?? 'Une erreur est survenue';
        this.loading = false;
      },
    });
  }
}
