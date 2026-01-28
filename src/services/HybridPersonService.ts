import type { CreatePersonForm, Person, UpdatePersonForm } from '@/types/person';
import { personSchema } from '@/types/person';
import { z } from 'zod';

import type { PersonRepository } from '@/repositories';
import { BaseService } from './BaseService';

const STORAGE_KEY = 'hybrid_people_cache';
const DELETED_IDS_KEY = 'hybrid_deleted_ids';

export class HybridPersonService extends BaseService {
  private personRepository: PersonRepository;
  private cachedPeople: Person[] = [];
  private deletedIds: Set<string> = new Set();

  constructor(personRepository: PersonRepository) {
    super();
    this.personRepository = personRepository;
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      const deleted = localStorage.getItem(DELETED_IDS_KEY);

      if (cached) {
        const parsedCache = JSON.parse(cached);
        // Валідація даних з localStorage
        const validatedCache = z.array(personSchema).safeParse(parsedCache);
        if (validatedCache.success) {
          this.cachedPeople = validatedCache.data;
        } else {
          console.error('Invalid cached data, clearing cache:', validatedCache.error);
          localStorage.removeItem(STORAGE_KEY);
          this.cachedPeople = [];
        }
      }

      if (deleted) {
        const parsedDeleted = JSON.parse(deleted);
        // Валідація списку видалених ID
        const validatedDeleted = z.array(z.string()).safeParse(parsedDeleted);
        if (validatedDeleted.success) {
          this.deletedIds = new Set(validatedDeleted.data);
        } else {
          console.error('Invalid deleted IDs, clearing:', validatedDeleted.error);
          localStorage.removeItem(DELETED_IDS_KEY);
          this.deletedIds = new Set();
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      // Очистити зіпсовані дані
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DELETED_IDS_KEY);
      this.cachedPeople = [];
      this.deletedIds = new Set();
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cachedPeople));
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...this.deletedIds]));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  async getAll(): Promise<Person[]> {
    // Викликати реальний API
    const response = await this.personRepository.getAll();

    // Об'єднати з локальними змінами
    const fromApi = response.people;

    // Застосувати локальні оновлення з кешу, але виключити видалені
    const mergedPeople = fromApi
      .filter((apiPerson) => !this.deletedIds.has(apiPerson.id))
      .map((apiPerson) => {
        const cachedPerson = this.cachedPeople.find((p) => p.id === apiPerson.id);
        return cachedPerson || apiPerson;
      });

    // Додати нові особи, які були створені локально (якщо є), виключаючи видалені
    const newLocalPeople = this.cachedPeople.filter(
      (cached) => !fromApi.some((api) => api.id === cached.id) && !this.deletedIds.has(cached.id)
    );

    const allPeople = [...mergedPeople, ...newLocalPeople];

    // Оновити кеш лише валідними даними
    this.cachedPeople = allPeople;
    this.saveToLocalStorage();

    return [...allPeople];
  }

  async getById(id: string): Promise<Person> {
    // Шукати в кеші
    const person = this.cachedPeople.find((p) => p.id === id);
    if (person) {
      return person;
    }

    // Якщо немає в кеші - завантажити з API
    const response = await this.personRepository.getById(id);
    return response.person;
  }

  async create(data: CreatePersonForm): Promise<Person> {
    // Викликати реальний API
    const response = await this.personRepository.create(data);
    const newPerson = personSchema.parse(response.person);

    // Додати в кеш
    this.cachedPeople.push(newPerson);
    this.saveToLocalStorage();

    return newPerson;
  }

  async update(id: string, data: UpdatePersonForm): Promise<Person> {
    // MOCK: оновити локально в кеші
    const index = this.cachedPeople.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Person not found');
    }

    const currentPerson = this.cachedPeople[index]!;

    // Створити оновлену особу з явним типом
    const updatedPersonData = {
      id: currentPerson.id,
      name: data.name !== undefined ? data.name : currentPerson.name,
      description: data.description !== undefined ? data.description : currentPerson.description,
      createdAt: currentPerson.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Валідувати ПЕРЕД оновленням кешу
    const validatedPerson = personSchema.parse(updatedPersonData);

    // Оновити кеш лише після успішної валідації
    this.cachedPeople[index] = validatedPerson;
    this.saveToLocalStorage();

    return validatedPerson;
  }

  async remove(id: string): Promise<void> {
    // MOCK: видалити локально з кешу
    const index = this.cachedPeople.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Person not found');
    }

    // Видалити з кешу
    this.cachedPeople.splice(index, 1);

    // Додати ID в список видалених
    this.deletedIds.add(id);

    this.saveToLocalStorage();
  }
}
