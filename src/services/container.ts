import { AuthRepository, PersonRepository } from '@/repositories';

import { AuthService } from './AuthService';
import { HybridPersonService } from './HybridPersonService';
import { PersonService } from './PersonService';

// Прапорець: використовувати hybrid (реальний GET/POST, mock UPDATE/DELETE)
const USE_HYBRID_SERVICE = true; // Змінити на false коли backend PATCH готовий

class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  private _authRepository?: AuthRepository;
  private _personRepository?: PersonRepository;

  private _authService?: AuthService;
  private _personService?: PersonService | HybridPersonService;

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

  getPersonService(): PersonService | HybridPersonService {
    if (USE_HYBRID_SERVICE) {
      return (this._personService ??= new HybridPersonService(this.getPersonRepository()));
    }

    return (this._personService ??= new PersonService(this.getPersonRepository()));
  }
}

export const container = ServiceContainer.getInstance();
