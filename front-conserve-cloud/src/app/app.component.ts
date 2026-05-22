import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionService } from './core/services/auth-session.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly authService = inject(AuthSessionService);
}
