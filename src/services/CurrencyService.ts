import { z } from 'zod';

import { CurrencyRepository } from '@/repositories';
import { CurrencySchema, type CreateCurrencyForm, type Currency } from '@/types/currency';

import { BaseService } from './BaseService';

export class CurrencyService extends BaseService {
  private currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    super();
    this.currencyRepository = currencyRepository;
  }

  async getAll(): Promise<Currency[]> {
    const response = await this.currencyRepository.getAll();
    return z.array(CurrencySchema).parse(response.currencies);
  }

  async create(data: CreateCurrencyForm): Promise<Currency> {
    const response = await this.currencyRepository.create(data);
    return CurrencySchema.parse(response.currency);
  }

  async remove(id: string): Promise<void> {
    await this.currencyRepository.remove(id);
  }
}
