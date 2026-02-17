import { apiClient } from '@/api';
import type { AuthResponse, SignupForm, SigninForm } from '@/types/auth';
import type { User } from '@/types/user';

import { BaseRepository } from './BaseRepository';

export class AuthRepository extends BaseRepository {
  private basePath = '/auth';

  constructor() {
    super(apiClient);
  }

  signup(credentials: SignupForm): Promise<AuthResponse> {
    return this.post(`${this.basePath}/signup`, credentials);
  }

  signin(credentials: SigninForm): Promise<AuthResponse> {
    return this.post(`${this.basePath}/login`, credentials);
  }

  me(): Promise<{ user: User }> {
    return this.get(`${this.basePath}/me`);
  }
}
