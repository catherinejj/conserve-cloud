import { Module } from '@nestjs/common';
import { AuthModule } from './presentation/modules/auth.module';
import { ConservesModule } from './presentation/modules/conserves.module';
import { UploadModule } from './presentation/modules/upload.module';

@Module({
  imports: [AuthModule, ConservesModule, UploadModule],
})
export class AppModule {}
