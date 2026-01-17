import { apiClient } from '@/api';
import type { SignupForm, AuthResponse, SigninForm } from '@/types/auth';
import type { User } from '@/types/user';

import { BaseRepository } from './BaseRepository';

export class AuthRepository extends BaseRepository {
  constructor() {
    super(apiClient);
  }

  signup(credentials: SignupForm): Promise<AuthResponse> {
    return this.post('/auth/signup', credentials);
  }

  signin(credentials: SigninForm): Promise<AuthResponse> {
    return this.post('/auth/login', credentials);
  }

  me(): Promise<{ user: User }> {
    return this.get('/auth/me');
  }
}
