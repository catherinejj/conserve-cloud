import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadPhotoUseCase {
  execute(filename: string): { url: string } {
    return { url: `/uploads/${filename}` };
  }
}
