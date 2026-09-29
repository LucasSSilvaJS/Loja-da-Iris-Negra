import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'tracks', versionKey: false })
export class Track {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  artist!: string;

  @Prop({ required: true })
  album!: string;

  @Prop({ required: true })
  durationLabel!: string;

  @Prop({ type: String, default: null })
  youtubeId!: string | null;

  @Prop({ required: true })
  externalUrl!: string;

  @Prop({ required: true })
  sortOrder!: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
