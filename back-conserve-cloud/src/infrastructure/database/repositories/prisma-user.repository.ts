import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<UserEntity | null>;
  }

  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
  }): Promise<UserEntity> {
    return this.prisma.user.create({ data }) as Promise<UserEntity>;
  }
}
