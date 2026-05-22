import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Conserve, FOOD_TYPE_LABELS } from '../../features/conserves/models/conserve.model';
import { ConserveApiService } from '../../features/conserves/services/conserve-api.service';

@Component({
  selector: 'app-conserve-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './conserve-detail.component.html',
  styleUrl: './conserve-detail.component.scss',
})
export class ConserveDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly conserveApi = inject(ConserveApiService);
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);

  conserve = signal<Conserve | null>(null);
  loading = signal(true);
  deleting = signal(false);
  error = signal('');

  readonly foodTypeLabels = FOOD_TYPE_LABELS;

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/']); return; }

    this.conserveApi.getById(id).subscribe({
      next: (data) => { this.conserve.set(this.normalizeConserve(data)); this.loading.set(false); },
      error: () => { this.error.set('Conserve introuvable.'); this.loading.set(false); },
    });
  }

  deleteConserve() {
    const conserve = this.conserve();
    if (!conserve || this.deleting()) return;

    const confirmed = window.confirm(`Supprimer la conserve "${conserve.name}" ?`);
    if (!confirmed) return;

    this.deleting.set(true);
    this.error.set('');

    this.conserveApi.delete(conserve.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set("Impossible de supprimer cette conserve.");
        this.deleting.set(false);
      },
    });
  }

  getStatus(expirationDate: string): 'expired' | 'soon' | 'ok' {
    const exp = new Date(expirationDate);
    if (Number.isNaN(exp.getTime())) return 'ok';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (exp < now) return 'expired';
    const soon = new Date(now);
    soon.setDate(soon.getDate() + 30);
    if (exp <= soon) return 'soon';
    return 'ok';
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return 'Non renseignée';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Non renseignée';

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private normalizeConserve(conserve: Conserve): Conserve {
    return {
      ...conserve,
      foodTypes: conserve.foodTypes ?? [],
      tags: conserve.tags ?? [],
    };
  }
}
