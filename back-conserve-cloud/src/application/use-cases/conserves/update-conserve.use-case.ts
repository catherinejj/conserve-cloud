import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FoodType } from '@prisma/client';
import {
  CONSERVE_REPOSITORY,
  IConserveRepository,
} from '../../../domain/repositories/conserve.repository.interface';
import {
  ITagRepository,
  TAG_REPOSITORY,
} from '../../../domain/repositories/tag.repository.interface';

export interface UpdateConserveInput {
  name: string;
  expirationDate: string;
  openingDate?: string;
  description?: string;
  photoUrl?: string;
  rawKeywords: string;
  foodTypes: FoodType[];
}

@Injectable()
export class UpdateConserveUseCase {
  constructor(
    @Inject(CONSERVE_REPOSITORY) private readonly conserveRepo: IConserveRepository,
    @Inject(TAG_REPOSITORY) private readonly tagRepo: ITagRepository,
  ) {}

  async execute(id: string, userId: string, input: UpdateConserveInput) {
    const tagNames = input.rawKeywords
      .split(',')
      .map((keyword) => keyword.trim().toLowerCase())
      .filter((keyword) => keyword.length > 0);

    const tags = await this.tagRepo.upsertMany(tagNames);

    const conserve = await this.conserveRepo.update(id, userId, {
      name: input.name,
      expirationDate: new Date(input.expirationDate),
      openingDate: input.openingDate ? new Date(input.openingDate) : null,
      description: input.description ?? null,
      photoUrl: input.photoUrl ?? null,
      rawKeywords: input.rawKeywords,
      foodTypes: input.foodTypes,
      tagIds: tags.map((tag) => tag.id),
    });

    if (!conserve) throw new NotFoundException('Conserve introuvable');
    return conserve;
  }
}
