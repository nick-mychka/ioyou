import { computed, type MaybeRef, toValue } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { container } from '@/services/container';
import { useStore } from '@/stores';
import type { CreatePersonForm, UpdatePersonForm } from '@/types/person';

const QUERY_KEY = 'people';

export function usePeople() {
  const personService = container.getPersonService();

  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => personService.getAll(),
  });
}

export const useCreatePerson = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const personService = container.getPersonService();

  return useMutation({
    mutationFn: (data: CreatePersonForm) => personService.create(data),
    onSuccess: async () => {
      toast.success('Person created successfully');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create person');
    },
  });
};

export const useUpdatePerson = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const personService = container.getPersonService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonForm }) =>
      personService.update(id, data),
    onSuccess: async (updatedPerson) => {
      toast.success('Person updated successfully');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY, updatedPerson.id] }),
      ]);
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update person');
    },
  });
};

export const useRemovePerson = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const store = useStore();
  const personService = container.getPersonService();

  return useMutation({
    mutationFn: (id: string) => personService.remove(id),
    onSuccess: async (_, id) => {
      toast.success('Person deleted successfully');

      if (store.selectedPersonId === id) store.resetPersonId();
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete person');
    },
  });
};

export function usePerson(id: MaybeRef<string>) {
  const personService = container.getPersonService();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY, toValue(id)]),
    queryFn: () => personService.getById(toValue(id)),
    enabled: computed(() => !!toValue(id)),
  });
}
