import type { Currency, CreateCurrencyForm } from '@/types/currency';

const STORAGE_KEY = 'ioyou_currencies';

export class CurrencyService {
  private getNextId(): number {
    const currencies = this.getAll();
    if (currencies.length === 0) return 1;

    const maxId = currencies.reduce((max, c) => (c.id > max ? c.id : max), 0);
    return maxId + 1;
  }

  getAll(): Currency[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with default USD currency
        const defaultCurrencies: Currency[] = [{ id: 1, name: 'USD', is_default: true }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCurrencies));
        return defaultCurrencies;
      }

      const parsed = JSON.parse(stored);

      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) {
        console.warn('Invalid currency data in localStorage (not an array), resetting to default');
        const defaultCurrencies: Currency[] = [{ id: 1, name: 'USD', is_default: true }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCurrencies));
        return defaultCurrencies;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to get currencies from localStorage:', error);
      return [{ id: 1, name: 'USD', is_default: true }];
    }
  }

  getDefault(): Currency | null {
    const currencies = this.getAll();
    return currencies.find((c) => c.is_default) || null;
  }

  create(data: CreateCurrencyForm): Currency {
    const currencies = this.getAll();

    // Check if currency with this name already exists
    const existing = currencies.find((c) => c.name.toLowerCase() === data.name.toLowerCase());
    if (existing) {
      throw new Error(`Currency "${data.name}" already exists`);
    }

    const newCurrency: Currency = {
      id: this.getNextId(),
      name: data.name.toUpperCase(),
      is_default: data.is_default,
    };

    // If new currency is default, remove default from others
    if (newCurrency.is_default) {
      currencies.forEach((c) => (c.is_default = false));
    }

    currencies.push(newCurrency);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currencies));

    return newCurrency;
  }

  update(id: number, data: Partial<CreateCurrencyForm>): Currency {
    const currencies = this.getAll();
    const index = currencies.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error('Currency not found');
    }

    const currentCurrency = currencies[index]!;

    // If updating name, check for duplicates
    if (data.name) {
      const existing = currencies.find(
        (c) => c.id !== id && c.name.toLowerCase() === data.name!.toLowerCase()
      );
      if (existing) {
        throw new Error(`Currency "${data.name}" already exists`);
      }
    }

    const updatedCurrency: Currency = {
      id: currentCurrency.id,
      name: data.name ? data.name.toUpperCase() : currentCurrency.name,
      is_default: data.is_default !== undefined ? data.is_default : currentCurrency.is_default,
    };

    // If setting this as default, remove default from others
    if (updatedCurrency.is_default) {
      currencies.forEach((c) => {
        if (c.id !== id) c.is_default = false;
      });
    }

    currencies[index] = updatedCurrency;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currencies));

    return updatedCurrency;
  }

  remove(id: number): void {
    const currencies = this.getAll();
    const currency = currencies.find((c) => c.id === id);

    if (!currency) {
      throw new Error('Currency not found');
    }

    // Don't allow deleting default currency
    if (currency.is_default) {
      throw new Error('Cannot delete default currency');
    }

    const filtered = currencies.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  search(query: string): Currency[] {
    const currencies = this.getAll();
    const lowerQuery = query.toLowerCase();
    return currencies.filter((c) => c.name.toLowerCase().includes(lowerQuery));
  }
}

export const currencyService = new CurrencyService();
