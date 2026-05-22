import { User } from '../../../core/models/user.model';

export interface AuthResponse {
  access_token: string;
  user: User;
}
