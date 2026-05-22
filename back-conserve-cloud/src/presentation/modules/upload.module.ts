import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UploadPhotoUseCase } from '../../application/use-cases/upload/upload-photo.use-case';
import { JwtAuthGuard } from '../../infrastructure/security/jwt.guard';
import { UploadController } from '../controllers/upload.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadPhotoUseCase, JwtAuthGuard],
})
export class UploadModule {}
