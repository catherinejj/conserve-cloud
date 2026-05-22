import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
  ) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ConflictException('Cet email est deja utilise');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({
      email,
      password: hashed,
      firstName,
      lastName,
      birthDate,
    });

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
