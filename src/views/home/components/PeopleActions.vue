<script lang="ts" setup>
import { Edit, EllipsisVertical, Trash2 } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <EllipsisVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><Edit /> Edit</DropdownMenuItem>
      <DropdownMenuItem variant="destructive"><Trash2 /> Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
