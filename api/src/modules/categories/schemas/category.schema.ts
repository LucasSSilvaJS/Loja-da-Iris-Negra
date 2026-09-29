import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'categories', timestamps: false, versionKey: false })
export class Category {
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  blurb!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, enum: ['banda', 'eva'], type: String })
  kind!: 'banda' | 'eva';

  @Prop({ required: true })
  sortOrder!: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
