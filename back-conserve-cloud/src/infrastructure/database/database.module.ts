import { Module } from '@nestjs/common';
import { CONSERVE_REPOSITORY } from '../../domain/repositories/conserve.repository.interface';
import { TAG_REPOSITORY } from '../../domain/repositories/tag.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { PrismaConserveRepository } from './repositories/prisma-conserve.repository';
import { PrismaTagRepository } from './repositories/prisma-tag.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: CONSERVE_REPOSITORY, useClass: PrismaConserveRepository },
    { provide: TAG_REPOSITORY, useClass: PrismaTagRepository },
  ],
  exports: [USER_REPOSITORY, CONSERVE_REPOSITORY, TAG_REPOSITORY],
})
export class DatabaseModule {}
