import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CONSERVE_REPOSITORY,
  IConserveRepository,
} from '../../../domain/repositories/conserve.repository.interface';

@Injectable()
export class DeleteConserveUseCase {
  constructor(
    @Inject(CONSERVE_REPOSITORY) private readonly conserveRepo: IConserveRepository,
  ) {}

  async execute(id: string, userId: string) {
    const deleted = await this.conserveRepo.delete(id, userId);
    if (!deleted) throw new NotFoundException('Conserve introuvable');
  }
}
