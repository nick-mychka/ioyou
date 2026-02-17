import { computed } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { container } from '@/services/container';
import type { CreateCurrencyForm, Currency } from '@/types/currency';

const QUERY_KEY = 'currencies';

export function useCurrencies() {
  const currencyService = container.getCurrencyService();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY]),
    queryFn: () => currencyService.getAll(),
  });
}

export const useCreateCurrency = ({ onSuccess }: { onSuccess?: (data: Currency) => void } = {}) => {
  const queryClient = useQueryClient();
  const currencyService = container.getCurrencyService();

  return useMutation({
    mutationFn: (data: CreateCurrencyForm) => currencyService.create(data),
    onSuccess: async (data) => {
      toast.success('Currency created successfully');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.(data);
    },
    onError: () => {
      toast.error('Failed to create currency');
    },
  });
};

export const useRemoveCurrency = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const currencyService = container.getCurrencyService();

  return useMutation({
    mutationFn: (id: string) => currencyService.remove(id),
    onSuccess: async () => {
      toast.success('Currency deleted successfully');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete currency');
    },
  });
};

export const useCurrencyCode = () => {
  const { data: currencies } = useCurrencies();

  return (currencyId: string) => {
    const currency = currencies.value?.find((c) => c.id === currencyId);
    return currency ? currency.code : '';
  };
};
