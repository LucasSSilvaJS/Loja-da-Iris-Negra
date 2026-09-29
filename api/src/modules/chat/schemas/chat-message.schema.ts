import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'chat_messages', timestamps: true, versionKey: false })
export class ChatMessage {
  @Prop({ required: true })
  nickname!: string;

  @Prop({ required: true })
  body!: string;

  createdAt?: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
ChatMessageSchema.index({ createdAt: -1 });
