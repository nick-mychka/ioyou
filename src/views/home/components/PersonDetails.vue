<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, X, Plus } from 'lucide-vue-next';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { usePerson } from '@/composables/usePeople';
import { formatDate } from '@/utils/dateFormatter';
import { AddRecordDialog } from './add-record';

const { personId } = defineProps<{
  personId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { data: person, isLoading } = usePerson(personId);
const isAddRecordDialogOpen = ref(false);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-muted-foreground">Details</h3>
      <Button variant="ghost" size="icon" @click="emit('close')">
        <X class="h-4 w-4" />
      </Button>
    </div>

    <template v-if="isLoading">
      <div class="flex items-center gap-4">
        <Skeleton class="h-16 w-16 rounded-full" />
        <div class="flex flex-col gap-2">
          <Skeleton class="h-8 w-48" />
          <Skeleton class="h-4 w-32" />
        </div>
      </div>
      <Skeleton class="h-20 w-full" />
      <Separator />
      <div class="flex flex-col gap-3">
        <Skeleton class="h-5 w-full" />
        <Skeleton class="h-5 w-full" />
      </div>
    </template>

    <template v-else-if="person">
      <div class="flex items-center gap-4">
        <Avatar class="h-16 w-16">
          <AvatarFallback class="text-2xl">{{
            person.name.charAt(0).toUpperCase()
          }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col">
          <h2 class="text-2xl font-semibold">{{ person.name }}</h2>
        </div>
      </div>

      <div v-if="person.description" class="text-sm text-muted-foreground">
        {{ person.description }}
      </div>

      <Button @click="isAddRecordDialogOpen = true" class="w-full">
        <Plus class="h-4 w-4" />
        Add Record
      </Button>

      <Separator />

      <div class="flex flex-col gap-3 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <Calendar class="h-4 w-4" />
          <span>Created: {{ formatDate(person.createdAt) }}</span>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <Calendar class="h-4 w-4" />
          <span>Updated: {{ formatDate(person.updatedAt) }}</span>
        </div>
      </div>
    </template>

    <AddRecordDialog v-if="person" v-model:open="isAddRecordDialogOpen" :person-id="personId" />
  </div>
</template>
