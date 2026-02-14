import { apiClient } from '@/api';
import type {
  CreatePersonRecordForm,
  UpdatePersonRecordForm,
  PersonRecord,
} from '@/types/personRecord';

import { BaseRepository } from './BaseRepository';

export class PersonRecordRepository extends BaseRepository {
  private basePath = '/people';

  constructor() {
    super(apiClient);
  }

  getAll(personId: string): Promise<{ records: PersonRecord[] }> {
    return this.get(`${this.basePath}/${personId}/records`);
  }

  getById(personId: string, id: string): Promise<{ record: PersonRecord }> {
    return this.get(`${this.basePath}/${personId}/records/${id}`);
  }

  create(personId: string, data: CreatePersonRecordForm): Promise<{ record: PersonRecord }> {
    return this.post(`${this.basePath}/${personId}/records`, data);
  }

  update(
    personId: string,
    id: string,
    data: UpdatePersonRecordForm
  ): Promise<{ record: PersonRecord }> {
    return this.put(`${this.basePath}/${personId}/records/${id}`, data);
  }

  remove(personId: string, id: string): Promise<void> {
    return this.delete(`${this.basePath}/${personId}/records/${id}`);
  }
}
