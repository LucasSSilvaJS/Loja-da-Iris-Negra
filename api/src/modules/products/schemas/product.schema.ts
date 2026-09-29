import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const MOTIFS = [
  'raven',
  'iris',
  'moon',
  'sticker',
  'cap',
  'corset',
  'jacket',
  'top',
] as const;

@Schema({ collection: 'products', timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  summary!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  priceCents!: number;

  @Prop({ required: true, index: true })
  categorySlug!: string;

  @Prop({ required: true, enum: ['iris-negra', 'eva'], type: String })
  maker!: 'iris-negra' | 'eva';

  @Prop({ required: true, enum: MOTIFS, type: String })
  motif!: (typeof MOTIFS)[number];

  @Prop({ required: true, default: '' })
  image!: string;

  @Prop({ type: [String], required: true })
  sizes!: string[];

  @Prop({ required: true, min: 0 })
  stock!: number;

  @Prop({ required: true, default: false })
  madeToOrder!: boolean;

  @Prop({ required: true, default: false })
  featured!: boolean;

  @Prop({ required: true })
  sortOrder!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
