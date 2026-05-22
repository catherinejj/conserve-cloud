import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { AuthApiService } from '../../../features/auth/services/auth-api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly session = inject(AuthSessionService);

  user = this.session.getCurrentUser();

  logout() {
    this.authApi.logout();
  }
}
