import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateConserveUseCase } from '../../application/use-cases/conserves/create-conserve.use-case';
import { DeleteConserveUseCase } from '../../application/use-cases/conserves/delete-conserve.use-case';
import { GetConserveByIdUseCase } from '../../application/use-cases/conserves/get-conserve-by-id.use-case';
import { GetConservesUseCase } from '../../application/use-cases/conserves/get-conserves.use-case';
import { UpdateConserveUseCase } from '../../application/use-cases/conserves/update-conserve.use-case';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { JwtAuthGuard } from '../../infrastructure/security/jwt.guard';
import { ConservesController } from '../controllers/conserves.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ConservesController],
  providers: [
    GetConservesUseCase,
    GetConserveByIdUseCase,
    CreateConserveUseCase,
    UpdateConserveUseCase,
    DeleteConserveUseCase,
    JwtAuthGuard,
  ],
})
export class ConservesModule {}
