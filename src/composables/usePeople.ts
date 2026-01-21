import { computed, type MaybeRef, toValue } from 'vue';
import { toast } from 'vue-sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { container } from '@/services/container';
import type { CreatePersonForm } from '@/types/person';

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
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      if (onSuccess) onSuccess();
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
