import { categoryRepository } from './category.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.validator';

export class CategoryService {
  constructor(private readonly repository = categoryRepository) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async create(data: CreateCategoryInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateCategoryInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.repository.delete(id);
    return { message: 'Category deleted successfully' };
  }
}

export const categoryService = new CategoryService();
