import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
} from '../modules/categories/schemas/category.schema';
import {
  Product,
  ProductSchema,
} from '../modules/products/schemas/product.schema';
import { Track, TrackSchema } from '../modules/playlist/schemas/track.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
