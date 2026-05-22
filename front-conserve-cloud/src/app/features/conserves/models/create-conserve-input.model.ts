import { FoodType } from './conserve.model';

export interface CreateConserveInput {
  name: string;
  expirationDate: string;
  openingDate?: string;
  description?: string;
  photoUrl?: string;
  rawKeywords: string;
  foodTypes: FoodType[];
}
