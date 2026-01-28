<script lang="ts" setup>
import { Edit, EllipsisVertical, Trash2 } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

defineProps<{
  personId: string;
}>();

defineEmits<{
  edit: [personId: string];
  delete: [personId: string];
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <EllipsisVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="$emit('edit', personId)"><Edit /> Edit</DropdownMenuItem>
      <DropdownMenuItem variant="destructive" @click="$emit('delete', personId)"
        ><Trash2 /> Delete</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>
