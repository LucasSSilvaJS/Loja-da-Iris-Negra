import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { ProductResponseDto } from './dto/product.response';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly products: Model<Product>,
    private readonly categories: CategoriesService,
  ) {}

  async list(category?: string, featured?: boolean): Promise<ProductResponseDto[]> {
    if (category) {
      await this.categories.findBySlug(category);
    }

    const filter: Record<string, unknown> = {};
    if (category) filter.categorySlug = category;
    if (featured) filter.featured = true;

    const docs = await this.products.find(filter).sort({ sortOrder: 1 }).lean();
    return docs.map((doc) => this.toResponse(doc));
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const doc = await this.products.findOne({ slug }).lean();
    if (!doc) {
      throw new NotFoundException('Essa peça saiu do catálogo.');
    }
    return this.toResponse(doc);
  }

  private toResponse(doc: Product): ProductResponseDto {
    return {
      slug: doc.slug,
      name: doc.name,
      summary: doc.summary,
      description: doc.description,
      priceCents: doc.priceCents,
      compareAtCents: doc.compareAtCents ?? null,
      priceOnRequest: doc.priceOnRequest ?? false,
      categorySlug: doc.categorySlug,
      maker: doc.maker,
      motif: doc.motif,
      image: doc.image ?? '',
      gallery: doc.gallery?.length ? doc.gallery : doc.image ? [doc.image] : [],
      sizes: doc.sizes,
      colors: doc.colors ?? [],
      stock: doc.stock,
      madeToOrder: doc.madeToOrder,
      featured: doc.featured,
    };
  }
}
