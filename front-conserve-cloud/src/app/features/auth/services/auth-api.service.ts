import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => this.session.persist(res)),
    );
  }

  register(
    firstName: string,
    lastName: string,
    birthDate: string,
    email: string,
    password: string,
  ) {
    return this.http.post<AuthResponse>('/api/auth/register', {
      firstName,
      lastName,
      birthDate,
      email,
      password,
    }).pipe(
      tap((res) => this.session.persist(res)),
    );
  }

  logout() {
    this.session.clear();
    this.router.navigate(['/login']);
  }
}
