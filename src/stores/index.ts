import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  const selectedPersonId = ref<string | null>(null);

  const setPersonId = (id: string | null) => {
    selectedPersonId.value = id;
  };

  const togglePersonId = (id: string) => {
    selectedPersonId.value = selectedPersonId.value === id ? null : id;
  };

  const resetPersonId = () => {
    selectedPersonId.value = null;
  };

  return { selectedPersonId, setPersonId, togglePersonId, resetPersonId };
});
