import { Injectable } from '@nestjs/common';
import { ConserveEntity } from '../../../domain/entities/conserve.entity';
import {
  CreateConserveData,
  IConserveRepository,
  UpdateConserveData,
} from '../../../domain/repositories/conserve.repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaConserveRepository implements IConserveRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: string): Promise<ConserveEntity[]> {
    return this.prisma.conserve.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { expirationDate: 'asc' },
    }) as Promise<ConserveEntity[]>;
  }

  findOneByUser(id: string, userId: string): Promise<ConserveEntity | null> {
    return this.prisma.conserve.findFirst({
      where: { id, userId },
      include: { tags: true },
    }) as Promise<ConserveEntity | null>;
  }

  create(userId: string, data: CreateConserveData): Promise<ConserveEntity> {
    return this.prisma.conserve.create({
      data: {
        name: data.name,
        expirationDate: data.expirationDate,
        openingDate: data.openingDate,
        description: data.description,
        photoUrl: data.photoUrl,
        rawKeywords: data.rawKeywords,
        foodTypes: data.foodTypes,
        userId,
        tags: { connect: data.tagIds.map((id) => ({ id })) },
      },
      include: { tags: true },
    }) as Promise<ConserveEntity>;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateConserveData,
  ): Promise<ConserveEntity | null> {
    const existing = await this.prisma.conserve.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) return null;

    return this.prisma.conserve.update({
      where: { id },
      data: {
        name: data.name,
        expirationDate: data.expirationDate,
        openingDate: data.openingDate,
        description: data.description,
        photoUrl: data.photoUrl,
        rawKeywords: data.rawKeywords,
        foodTypes: data.foodTypes,
        tags: { set: data.tagIds.map((tagId) => ({ id: tagId })) },
      },
      include: { tags: true },
    }) as Promise<ConserveEntity>;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.conserve.deleteMany({
      where: { id, userId },
    });

    return result.count > 0;
  }
}
