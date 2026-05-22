import { Inject, Injectable } from '@nestjs/common';
import {
  CONSERVE_REPOSITORY,
  IConserveRepository,
} from '../../../domain/repositories/conserve.repository.interface';

@Injectable()
export class GetConservesUseCase {
  constructor(
    @Inject(CONSERVE_REPOSITORY) private readonly conserveRepo: IConserveRepository,
  ) {}

  execute(userId: string) {
    return this.conserveRepo.findAllByUser(userId);
  }
}
