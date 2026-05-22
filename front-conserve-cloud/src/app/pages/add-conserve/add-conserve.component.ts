import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Conserve, FOOD_TYPE_LABELS, FoodType } from '../../features/conserves/models/conserve.model';
import { ConserveApiService } from '../../features/conserves/services/conserve-api.service';

@Component({
  selector: 'app-add-conserve',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-conserve.component.html',
  styleUrl: './add-conserve.component.scss',
})
export class AddConserveComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly conserveApi = inject(ConserveApiService);
  private readonly session = inject(AuthSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly foodTypes: FoodType[] = ['LEGUME', 'FRUIT', 'VIANDE', 'POISSON', 'AUTRE'];
  readonly foodTypeLabels = FOOD_TYPE_LABELS;
  readonly today = new Date().toISOString().split('T')[0];

  selectedFoodTypes = signal<FoodType[]>([]);
  foodTypeError = signal(false);
  loading = signal(false);
  loadingConserve = signal(false);
  error = signal('');
  editId = signal<string | null>(null);

  photoUrl = signal<string | null>(null);
  photoPreview = signal<string | null>(null);
  uploading = signal(false);
  uploadError = signal('');

  form: FormGroup = this.fb.group({
    name:           ['', [Validators.required]],
    expirationDate: ['', [Validators.required]],
    openingDate:    [''],
    rawKeywords:    ['', [Validators.required]],
    description:    [''],
  });

  constructor() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.editId.set(id);
    this.loadingConserve.set(true);
    this.conserveApi.getById(id).subscribe({
      next: (conserve) => {
        this.fillForm(conserve);
        this.loadingConserve.set(false);
      },
      error: () => {
        this.error.set('Conserve introuvable.');
        this.loadingConserve.set(false);
      },
    });
  }

  get name()           { return this.form.get('name')!; }
  get expirationDate() { return this.form.get('expirationDate')!; }
  get rawKeywords()    { return this.form.get('rawKeywords')!; }
  get isEditMode()     { return this.editId() !== null; }

  toggleFoodType(type: FoodType) {
    const current = this.selectedFoodTypes();
    this.selectedFoodTypes.set(
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    );
    if (this.selectedFoodTypes().length > 0) this.foodTypeError.set(false);
  }

  isSelected(type: FoodType) {
    return this.selectedFoodTypes().includes(type);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  removePhoto() {
    this.photoUrl.set(null);
    this.photoPreview.set(null);
    this.uploadError.set('');
  }

  private processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.uploadError.set('Seules les images sont acceptées (JPG, PNG, WEBP…)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError.set('Taille maximale : 5 Mo');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => this.photoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploading.set(true);
    this.uploadError.set('');

    this.conserveApi.uploadPhoto(file).subscribe({
      next: (res) => {
        this.photoUrl.set(res.url);
        this.uploading.set(false);
      },
      error: () => {
        this.uploadError.set('Echec du téléchargement, réessayez.');
        this.photoPreview.set(null);
        this.uploading.set(false);
      },
    });
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.selectedFoodTypes().length === 0) this.foodTypeError.set(true);

    if (this.form.invalid || this.selectedFoodTypes().length === 0) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { openingDate, description, ...rest } = this.form.value;
    const input = {
      ...rest,
      openingDate: openingDate || undefined,
      description: description || undefined,
      photoUrl: this.photoUrl() || undefined,
      foodTypes: this.selectedFoodTypes(),
    };
    const id = this.editId();

    const request = id
      ? this.conserveApi.update(id, input)
      : this.conserveApi.create(input);

    request.subscribe({
      next: (conserve) => this.router.navigate(id ? ['/conserves', conserve.id] : ['/']),
      error: () => {
        this.error.set("Une erreur est survenue lors de l'enregistrement.");
        this.loading.set(false);
      },
    });
  }

  private fillForm(conserve: Conserve) {
    this.form.patchValue({
      name: conserve.name,
      expirationDate: this.toDateInput(conserve.expirationDate),
      openingDate: conserve.openingDate ? this.toDateInput(conserve.openingDate) : '',
      rawKeywords: conserve.rawKeywords,
      description: conserve.description ?? '',
    });
    this.selectedFoodTypes.set(conserve.foodTypes);
    this.photoUrl.set(conserve.photoUrl);
    this.photoPreview.set(conserve.photoUrl);
  }

  private toDateInput(value: string) {
    return new Date(value).toISOString().split('T')[0];
  }
}
