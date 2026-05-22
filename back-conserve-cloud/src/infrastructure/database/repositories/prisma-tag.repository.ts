import { Injectable } from '@nestjs/common';
import { TagEntity } from '../../../domain/entities/tag.entity';
import { ITagRepository } from '../../../domain/repositories/tag.repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMany(names: string[]): Promise<TagEntity[]> {
    return Promise.all(
      names.map((name) =>
        this.prisma.tag.upsert({ where: { name }, create: { name }, update: {} }),
      ),
    ) as Promise<TagEntity[]>;
  }
}
