import { apiClient } from '@/api';
import type { CreateCurrencyForm, Currency } from '@/types/currency';

import { BaseRepository } from './BaseRepository';

export class CurrencyRepository extends BaseRepository {
  private basePath = '/currencies';

  constructor() {
    super(apiClient);
  }

  getAll(): Promise<{ currencies: Currency[] }> {
    return this.get(this.basePath);
  }

  create(data: CreateCurrencyForm): Promise<{ currency: Currency }> {
    return this.post(this.basePath, data);
  }

  remove(id: string): Promise<void> {
    return this.delete(`${this.basePath}/${id}`);
  }
}
