import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  Conserve,
  FOOD_TYPE_LABELS,
  FoodType,
} from '../../features/conserves/models/conserve.model';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { ConserveApiService } from '../../features/conserves/services/conserve-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly conserveApi = inject(ConserveApiService);
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);

  user = this.session.getCurrentUser();

  allConserves = signal<Conserve[]>([]);
  loading = signal(true);
  error = signal('');

  keyword = signal('');
  selectedFoodType = signal<FoodType | ''>('');

  readonly foodTypes: FoodType[] = ['LEGUME', 'FRUIT', 'VIANDE', 'POISSON', 'AUTRE'];
  readonly foodTypeLabels = FOOD_TYPE_LABELS;

  filteredConserves = computed(() => {
    let result = [...this.allConserves()];

    const kw = this.keyword().toLowerCase().trim();
    if (kw) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.rawKeywords.toLowerCase().includes(kw) ||
          c.tags.some((t) => t.name.toLowerCase().includes(kw)),
      );
    }

    const type = this.selectedFoodType();
    if (type) {
      result = result.filter((c) => c.foodTypes.includes(type));
    }

    return result.sort(
      (a, b) =>
        this.getDateTimestamp(a.expirationDate) - this.getDateTimestamp(b.expirationDate),
    );
  });

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.conserveApi.getAll().subscribe({
      next: (data) => {
        this.allConserves.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les conserves');
        this.loading.set(false);
      },
    });
  }

  setFoodType(type: string) {
    this.selectedFoodType.set(type as FoodType | '');
  }

  getStatus(expirationDate: string): 'expired' | 'soon' | 'ok' {
    const exp = new Date(expirationDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (exp < now) return 'expired';
    const soon = new Date(now);
    soon.setDate(soon.getDate() + 30);
    if (exp <= soon) return 'soon';
    return 'ok';
  }

  private getDateTimestamp(value: string): number {
    const date = new Date(value).getTime();
    return Number.isNaN(date) ? Number.MAX_SAFE_INTEGER : date;
  }

}
