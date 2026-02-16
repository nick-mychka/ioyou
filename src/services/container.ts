import {
  AuthRepository,
  CurrencyRepository,
  PersonRecordRepository,
  PersonRepository,
} from '@/repositories';

import { AuthService } from './AuthService';
import { PersonService } from './PersonService';
import { PersonRecordService } from './PersonRecordService';
import { CurrencyService } from './CurrencyService';

class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  private _authRepository?: AuthRepository;
  private _personRepository?: PersonRepository;
  private _personRecordRepository?: PersonRecordRepository;
  private _currencyRepository?: CurrencyRepository;

  private _authService?: AuthService;
  private _personService?: PersonService;
  private _personRecordService?: PersonRecordService;
  private _currencyService?: CurrencyService;

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
  getPersonRecordRepository(): PersonRecordRepository {
    return (this._personRecordRepository ??= new PersonRecordRepository());
  }
  getCurrencyRepository(): CurrencyRepository {
    return (this._currencyRepository ??= new CurrencyRepository());
  }

  // Services
  getAuthService(): AuthService {
    return (this._authService ??= new AuthService(this.getAuthRepository()));
  }
  getPersonService(): PersonService {
    return (this._personService ??= new PersonService(this.getPersonRepository()));
  }
  getPersonRecordService(): PersonRecordService {
    return (this._personRecordService ??= new PersonRecordService(
      this.getPersonRecordRepository()
    ));
  }
  getCurrencyService(): CurrencyService {
    return (this._currencyService ??= new CurrencyService(this.getCurrencyRepository()));
  }
}

export const container = ServiceContainer.getInstance();
