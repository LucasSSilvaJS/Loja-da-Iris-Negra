import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryResponseDto } from './dto/category.response';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categories: Model<Category>,
  ) {}

  async list(): Promise<CategoryResponseDto[]> {
    const docs = await this.categories.find().sort({ sortOrder: 1 }).lean();
    return docs.map((doc) => this.toResponse(doc));
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const doc = await this.categories.findOne({ slug }).lean();
    if (!doc) {
      throw new NotFoundException('Essa prateleira não existe.');
    }
    return this.toResponse(doc);
  }

  private toResponse(
    doc: Pick<
      Category,
      'slug' | 'name' | 'blurb' | 'description' | 'kind' | 'sortOrder'
    >,
  ): CategoryResponseDto {
    return {
      slug: doc.slug,
      name: doc.name,
      blurb: doc.blurb,
      description: doc.description,
      kind: doc.kind,
      sortOrder: doc.sortOrder,
    };
  }
}
