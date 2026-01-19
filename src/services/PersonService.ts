import { z } from 'zod';

import { PersonRepository } from '@/repositories';
import {
  personSchema,
  type Person,
  type CreatePersonForm,
  type UpdatePersonForm,
} from '@/types/person';

import { BaseService } from './BaseService';

export class PersonService extends BaseService {
  private personRepository: PersonRepository;

  constructor(personRepository: PersonRepository) {
    super();
    this.personRepository = personRepository;
  }

  async getAll(): Promise<Person[]> {
    const response = await this.personRepository.getAll();
    return z.array(personSchema).parse(response.people);
  }

  async getById(id: string): Promise<Person> {
    const response = await this.personRepository.getById(id);
    return personSchema.parse(response.person);
  }

  async create(data: CreatePersonForm): Promise<Person> {
    const response = await this.personRepository.create(data);
    return personSchema.parse(response.person);
  }

  async update(id: string, data: UpdatePersonForm): Promise<Person> {
    const response = await this.personRepository.update(id, data);
    return personSchema.parse(response.person);
  }

  async remove(id: string): Promise<void> {
    await this.personRepository.remove(id);
  }
}
