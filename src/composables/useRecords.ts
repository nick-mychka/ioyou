import { computed, type MaybeRef, toValue } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { container } from '@/services/container';
import type { CreatePersonRecordForm, UpdatePersonRecordForm } from '@/types/personRecord';

const QUERY_KEY = 'records';

export function useRecords(personId: MaybeRef<string>) {
  const recordService = container.getPersonRecordService();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY, toValue(personId)]),
    queryFn: () => recordService.getAll(toValue(personId)),
  });
}

export const useCreateRecord = (
  personId: MaybeRef<string>,
  { onSuccess }: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();
  const recordService = container.getPersonRecordService();

  return useMutation({
    mutationFn: (data: CreatePersonRecordForm) => recordService.create(toValue(personId), data),
    onSuccess: async () => {
      toast.success('Record created successfully');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create record');
    },
  });
};

export const useUpdateRecord = (
  personId: MaybeRef<string>,
  { onSuccess }: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();
  const recordService = container.getPersonRecordService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonRecordForm }) =>
      recordService.update(toValue(personId), id, data),
    onSuccess: async () => {
      toast.success('Record updated successfully');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update record');
    },
  });
};

export const useRemoveRecord = (
  personId: MaybeRef<string>,
  { onSuccess }: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();
  const recordService = container.getPersonRecordService();

  return useMutation({
    mutationFn: (id: string) => recordService.remove(toValue(personId), id),
    onSuccess: async () => {
      toast.success('Record deleted successfully');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete record');
    },
  });
};

export function useRecord(personId: MaybeRef<string>, id: MaybeRef<string>) {
  const recordService = container.getPersonRecordService();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY, toValue(personId), toValue(id)]),
    queryFn: () => recordService.getById(toValue(personId), toValue(id)),
    enabled: computed(() => !!toValue(id)),
  });
}
