import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Conserve } from '../models/conserve.model';
import { CreateConserveInput } from '../models/create-conserve-input.model';

@Injectable({ providedIn: 'root' })
export class ConserveApiService {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Conserve[]>('/api/conserves');
  }

  getById(id: string) {
    return this.http.get<Conserve>(`/api/conserves/${id}`);
  }

  create(input: CreateConserveInput) {
    return this.http.post<Conserve>('/api/conserves', input);
  }

  update(id: string, input: CreateConserveInput) {
    return this.http.patch<Conserve>(`/api/conserves/${id}`, input);
  }

  delete(id: string) {
    return this.http.delete<{ deleted: true }>(`/api/conserves/${id}`);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>('/api/upload', formData);
  }
}
