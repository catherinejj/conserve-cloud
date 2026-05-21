import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'front-conserve-cloud';
  healthStatus = 'verification en cours';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    if (!isPlatformBrowser(platformId)) {
      return;
    }

    this.http.get<{ status: string }>('/api/health').subscribe({
      next: (health) => {
        this.healthStatus = health.status;
      },
      error: () => {
        this.healthStatus = 'erreur';
      },
    });
  }
}
