import { apiClient } from '@/api';
import type { Person, CreatePersonForm, UpdatePersonForm } from '@/types/person';

import { BaseRepository } from './BaseRepository';

export class PersonRepository extends BaseRepository {
  private basePath = '/people';

  constructor() {
    super(apiClient);
  }

  getAll(): Promise<{ people: Person[] }> {
    return this.get(this.basePath);
  }

  getById(id: string): Promise<{ person: Person }> {
    return this.get(`${this.basePath}/${id}`);
  }

  create(data: CreatePersonForm): Promise<{ person: Person }> {
    return this.post(this.basePath, data);
  }

  update(id: string, data: UpdatePersonForm): Promise<{ person: Person }> {
    return this.patch(`${this.basePath}/${id}`, data);
  }

  remove(id: string): Promise<void> {
    return this.delete(`${this.basePath}/${id}`);
  }
}
