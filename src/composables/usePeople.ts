import { computed, type MaybeRef, toValue } from 'vue';
import { toast } from 'vue-sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { container } from '@/services/container';
import type { CreatePersonForm, Person, UpdatePersonForm } from '@/types/person';

const QUERY_KEY = 'people';

export function usePeople() {
  // const queryClient = useQueryClient();
  const personService = container.getPersonService();

  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => personService.getAll(),
  });

  // const updateMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: UpdatePersonForm }) =>
  //     personService.update(id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  //   },
  // });

  // const removeMutation = useMutation({
  //   mutationFn: (id: string) => personService.remove(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  //   },
  // });

  // return {
  //   people,
  //   isLoading,
  //   error,
  //   update: updateMutation.mutate,
  //   updateAsync: updateMutation.mutateAsync,
  //   isUpdating: updateMutation.isPending,
  //   remove: removeMutation.mutate,
  //   removeAsync: removeMutation.mutateAsync,
  //   isRemoving: removeMutation.isPending,
  // };
}

export const useCreatePerson = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const personService = container.getPersonService();

  return useMutation({
    mutationFn: (data: CreatePersonForm) => personService.create(data),
    onSuccess: async () => {
      toast.success('Person created successfully');
      try {
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Failed to invalidate queries:', error);
      }
    },
  });
};

export const useUpdatePerson = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const personService = container.getPersonService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonForm }) =>
      personService.update(id, data),
    onSuccess: async (updatedPerson) => {
      toast.success('Person updated successfully');

      queryClient.setQueryData([QUERY_KEY], (old: Person[] | undefined) => {
        if (!old) return [];

        const personExists = old.some((person) => person.id === updatedPerson.id);

        if (personExists) {
          return old.map((person) => (person.id === updatedPerson.id ? updatedPerson : person));
        } else {
          return [...old, updatedPerson];
        }
      });

      try {
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEY, updatedPerson.id] });
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Failed to invalidate queries:', error);
      }
    },
    onError: () => {
      toast.error('Failed to update person');
    },
  });
};

export const useRemovePerson = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const personService = container.getPersonService();

  return useMutation({
    mutationFn: (id: string) => personService.remove(id),
    onSuccess: async (_data, deletedId) => {
      toast.success('Person deleted successfully');

      queryClient.setQueryData([QUERY_KEY], (old: Person[] | undefined) => {
        if (!old) return [];
        return old.filter((person) => person.id !== deletedId);
      });

      if (onSuccess) onSuccess();
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
