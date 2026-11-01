import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { categoriesSeed, productsSeed, tracksSeed } from './seed.data';
import { Category } from '../modules/categories/schemas/category.schema';
import { Product } from '../modules/products/schemas/product.schema';
import { Track } from '../modules/playlist/schemas/track.schema';

function anglesOf(image: string): string[] {
  const dot = image.lastIndexOf('.');
  if (dot < 0) return [image];
  const stem = image.slice(0, dot);
  const ext = image.slice(dot);
  return [image, `${stem}-2${ext}`, `${stem}-3${ext}`];
}

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private readonly categories: Model<Category>,
    @InjectModel(Product.name) private readonly products: Model<Product>,
    @InjectModel(Track.name) private readonly tracks: Model<Track>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.syncCategories();
    await this.syncProducts();
    await this.syncTracks();
  }

  private async syncCategories(): Promise<void> {
    const slugs = categoriesSeed.map((category) => category.slug);
    await this.categories.deleteMany({ slug: { $nin: slugs } });
    for (const category of categoriesSeed) {
      await this.categories.updateOne({ slug: category.slug }, { $set: category }, { upsert: true });
    }
  }

  private async syncProducts(): Promise<void> {
    const slugs = productsSeed.map((product) => product.slug);
    await this.products.deleteMany({ slug: { $nin: slugs } });
    for (const product of productsSeed) {
      await this.products.updateOne(
        { slug: product.slug },
        { $set: { ...product, gallery: anglesOf(product.image) } },
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
