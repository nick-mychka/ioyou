<script lang="ts" setup>
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-vue-next';

import { usePeople } from '@/composables/usePeople';

const { data, isLoading, error } = usePeople();
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <Card v-for="person in data" :key="person.id" class="@container/card">
      <CardHeader>
        <CardTitle class="text-2xl">
          {{ person.name }}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription>{{ person.description }}</CardDescription>
      </CardContent>
    </Card>
  </div>
</template>
