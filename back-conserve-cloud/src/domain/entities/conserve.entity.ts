import { TagEntity } from './tag.entity';

export type FoodType = 'LEGUME' | 'FRUIT' | 'VIANDE' | 'POISSON' | 'AUTRE';

export interface ConserveEntity {
  id: string;
  name: string;
  expirationDate: Date;
  openingDate: Date | null;
  description: string | null;
  photoUrl: string | null;
  rawKeywords: string;
  foodTypes: FoodType[];
  tags: TagEntity[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
