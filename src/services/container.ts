import { AuthRepository } from '@/repositories';

import { AuthService } from './AuthService';

class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  private _authRepository?: AuthRepository;

  private _authService?: AuthService;

  private constructor() {}

  static getInstance(): ServiceContainer {
    return (ServiceContainer.instance ??= new ServiceContainer());
  }

  // Repositories
  getAuthRepository(): AuthRepository {
    return (this._authRepository ??= new AuthRepository());
  }

  // Services
  getAuthService(): AuthService {
    return (this._authService ??= new AuthService(this.getAuthRepository()));
  }
}

export const container = ServiceContainer.getInstance();
