import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
  }): Promise<UserEntity>;
}
