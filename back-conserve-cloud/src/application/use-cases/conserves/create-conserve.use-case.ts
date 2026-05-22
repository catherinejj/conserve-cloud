import { Inject, Injectable } from '@nestjs/common';
import { FoodType } from '@prisma/client';
import {
  CONSERVE_REPOSITORY,
  IConserveRepository,
} from '../../../domain/repositories/conserve.repository.interface';
import {
  ITagRepository,
  TAG_REPOSITORY,
} from '../../../domain/repositories/tag.repository.interface';

export interface CreateConserveInput {
  name: string;
  expirationDate: string;
  openingDate?: string;
  description?: string;
  photoUrl?: string;
  rawKeywords: string;
  foodTypes: FoodType[];
}

@Injectable()
export class CreateConserveUseCase {
  constructor(
    @Inject(CONSERVE_REPOSITORY) private readonly conserveRepo: IConserveRepository,
    @Inject(TAG_REPOSITORY) private readonly tagRepo: ITagRepository,
  ) {}

  async execute(userId: string, input: CreateConserveInput) {
    const tagNames = input.rawKeywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    const tags = await this.tagRepo.upsertMany(tagNames);

    return this.conserveRepo.create(userId, {
      name: input.name,
      expirationDate: new Date(input.expirationDate),
      openingDate: input.openingDate ? new Date(input.openingDate) : null,
      description: input.description ?? null,
      photoUrl: input.photoUrl ?? null,
      rawKeywords: input.rawKeywords,
      foodTypes: input.foodTypes,
      tagIds: tags.map((t) => t.id),
    });
  }
}
