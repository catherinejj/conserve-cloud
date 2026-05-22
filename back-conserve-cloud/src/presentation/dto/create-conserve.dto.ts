import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FoodType } from '@prisma/client';

export class CreateConserveDto {
  @ApiProperty({ example: 'Haricots verts' })
  name: string;

  @ApiProperty({ example: '2026-06-01' })
  expirationDate: string;

  @ApiPropertyOptional({ example: '2025-01-10' })
  openingDate?: string;

  @ApiPropertyOptional({ example: 'Très bonne conserve maison' })
  description?: string;

  @ApiPropertyOptional({ example: '/uploads/photo.jpg' })
  photoUrl?: string;

  @ApiProperty({ example: 'tomate, bio, france' })
  rawKeywords: string;

  @ApiProperty({ enum: FoodType, isArray: true, example: ['LEGUME'] })
  foodTypes: FoodType[];
}
