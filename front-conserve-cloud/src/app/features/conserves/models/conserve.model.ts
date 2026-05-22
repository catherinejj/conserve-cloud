export type FoodType = 'LEGUME' | 'FRUIT' | 'VIANDE' | 'POISSON' | 'AUTRE';

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  LEGUME: 'Légume',
  FRUIT: 'Fruit',
  VIANDE: 'Viande',
  POISSON: 'Poisson',
  AUTRE: 'Autre',
};

export interface Tag {
  id: string;
  name: string;
}

export interface Conserve {
  id: string;
  name: string;
  expirationDate: string;
  openingDate: string | null;
  description: string | null;
  photoUrl: string | null;
  rawKeywords: string;
  foodTypes: FoodType[];
  tags: Tag[];
  userId: string;
}
