import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { categoriesSeed, productsSeed, tracksSeed } from './seed.data';
import { Category } from '../modules/categories/schemas/category.schema';
import { Product } from '../modules/products/schemas/product.schema';
import { Track } from '../modules/playlist/schemas/track.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private readonly categories: Model<Category>,
    @InjectModel(Product.name) private readonly products: Model<Product>,
    @InjectModel(Track.name) private readonly tracks: Model<Track>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.categories.estimatedDocumentCount();
    if (existing === 0) {
      await this.categories.insertMany(categoriesSeed);
    }
    await this.syncProducts();
    await this.syncTracks();
  }

  private async syncProducts(): Promise<void> {
    for (const product of productsSeed) {
      const image = `/produtos/${product.slug}.png`;
      await this.products.updateOne(
        { slug: product.slug },
        { $set: { image }, $setOnInsert: product },
        { upsert: true },
      );
    }
  }

  private async syncTracks(): Promise<void> {
    const current = await this.tracks.find().sort({ sortOrder: 1 }).lean();
    const same =
      current.length === tracksSeed.length &&
      current.every(
        (doc, index) =>
          doc.title === tracksSeed[index]?.title &&
          doc.youtubeId === tracksSeed[index]?.youtubeId,
      );
    if (same) return;
    await this.tracks.deleteMany({});
    await this.tracks.insertMany(tracksSeed);
  }
}
