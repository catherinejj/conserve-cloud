import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Marie' })
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  lastName: string;

  @ApiProperty({ example: '1990-01-15' })
  birthDate: string;

  @ApiProperty({ example: 'marie@email.com' })
  email: string;

  @ApiProperty({ example: 'motdepasse123' })
  password: string;
}
