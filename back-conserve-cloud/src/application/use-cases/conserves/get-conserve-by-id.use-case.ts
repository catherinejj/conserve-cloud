import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CONSERVE_REPOSITORY,
  IConserveRepository,
} from '../../../domain/repositories/conserve.repository.interface';

@Injectable()
export class GetConserveByIdUseCase {
  constructor(
    @Inject(CONSERVE_REPOSITORY) private readonly conserveRepo: IConserveRepository,
  ) {}

  async execute(id: string, userId: string) {
    const conserve = await this.conserveRepo.findOneByUser(id, userId);
    if (!conserve) throw new NotFoundException('Conserve introuvable');
    return conserve;
  }
}
