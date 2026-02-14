import { AuthRepository } from '@/repositories';
import {
  AuthResponseSchema,
  type SignupForm,
  type AuthResponse,
  type SigninForm,
} from '@/types/auth';
import { UserSchema, type User } from '@/types/user';

import { BaseService } from './BaseService';

class AuthService extends BaseService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    super();
    this.authRepository = authRepository;
  }

  async signup(credentials: SignupForm): Promise<AuthResponse> {
    const response = await this.authRepository.signup(credentials);
    return AuthResponseSchema.parse(response);
  }

  async signin(credentials: SigninForm): Promise<AuthResponse> {
    const response = await this.authRepository.signin(credentials);
    return AuthResponseSchema.parse(response);
  }

  async me(): Promise<User> {
    const response = await this.authRepository.me();
    return UserSchema.parse(response.user);
  }
}

export { AuthService };
