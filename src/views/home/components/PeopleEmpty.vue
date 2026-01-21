<script lang="ts" setup>
import { Users } from 'lucide-vue-next';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import AddPersonButton from './add-person/AddPersonButton.vue';
</script>

<template>
  <Empty>
    <EmptyMedia variant="icon">
      <Users />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No people yet</EmptyTitle>
      <EmptyDescription>
        Start by adding someone you owe money to or who owes you. Track balances and settle up
        easily.
      </EmptyDescription>
    </EmptyHeader>
    <AddPersonButton />
  </Empty>
</template>
