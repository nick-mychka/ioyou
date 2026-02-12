<script lang="ts" setup>
import { BookUser } from 'lucide-vue-next';

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
</script>

<template>
  <Empty>
    <EmptyMedia variant="icon">
      <BookUser />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No person selected</EmptyTitle>
      <EmptyDescription>Select someone from the list to view details</EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
