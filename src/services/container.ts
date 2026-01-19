import { AuthRepository, PersonRepository } from '@/repositories';

import { AuthService } from './AuthService';
import { PersonService } from './PersonService';

class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  private _authRepository?: AuthRepository;
  private _personRepository?: PersonRepository;

  private _authService?: AuthService;
  private _personService?: PersonService;

  private constructor() {}

  static getInstance(): ServiceContainer {
    return (ServiceContainer.instance ??= new ServiceContainer());
  }

  // Repositories
  getAuthRepository(): AuthRepository {
    return (this._authRepository ??= new AuthRepository());
  }

  getPersonRepository(): PersonRepository {
    return (this._personRepository ??= new PersonRepository());
  }

  // Services
  getAuthService(): AuthService {
    return (this._authService ??= new AuthService(this.getAuthRepository()));
  }

  getPersonService(): PersonService {
    return (this._personService ??= new PersonService(this.getPersonRepository()));
  }
}

export const container = ServiceContainer.getInstance();
