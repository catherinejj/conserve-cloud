import { ConserveEntity, FoodType } from '../entities/conserve.entity';

export const CONSERVE_REPOSITORY = Symbol('IConserveRepository');

export interface CreateConserveData {
  name: string;
  expirationDate: Date;
  openingDate?: Date | null;
  description?: string | null;
  photoUrl?: string | null;
  rawKeywords: string;
  foodTypes: FoodType[];
  tagIds: string[];
}

export interface UpdateConserveData extends CreateConserveData {}

export interface IConserveRepository {
  findAllByUser(userId: string): Promise<ConserveEntity[]>;
  findOneByUser(id: string, userId: string): Promise<ConserveEntity | null>;
  create(userId: string, data: CreateConserveData): Promise<ConserveEntity>;
  update(id: string, userId: string, data: UpdateConserveData): Promise<ConserveEntity | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
