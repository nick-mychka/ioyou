import { z } from 'zod';

import { PersonRecordRepository } from '@/repositories';
import {
  PersonRecordSchema,
  type CreatePersonRecordForm,
  type PersonRecord,
  type UpdatePersonRecordForm,
} from '@/types/personRecord';

import { BaseService } from './BaseService';

export class PersonRecordService extends BaseService {
  private personRecordRepository: PersonRecordRepository;

  constructor(personRecordRepository: PersonRecordRepository) {
    super();
    this.personRecordRepository = personRecordRepository;
  }

  async getAll(personId: string): Promise<PersonRecord[]> {
    const response = await this.personRecordRepository.getAll(personId);
    return z.array(PersonRecordSchema).parse(response.records);
  }

  async getById(personId: string, id: string): Promise<PersonRecord> {
    const response = await this.personRecordRepository.getById(personId, id);
    return PersonRecordSchema.parse(response.record);
  }

  async create(personId: string, data: CreatePersonRecordForm): Promise<PersonRecord> {
    const response = await this.personRecordRepository.create(personId, data);
    return PersonRecordSchema.parse(response.record);
  }

  async update(personId: string, id: string, data: UpdatePersonRecordForm): Promise<PersonRecord> {
    const response = await this.personRecordRepository.update(personId, id, data);
    return PersonRecordSchema.parse(response.record);
  }

  async remove(personId: string, id: string): Promise<void> {
    await this.personRecordRepository.remove(personId, id);
  }
}
