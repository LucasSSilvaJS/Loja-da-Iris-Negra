import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  productSlug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  size!: string;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  unitPriceCents!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ collection: 'orders', timestamps: true, versionKey: false })
export class Order {
  @Prop({ required: true, unique: true })
  publicId!: string;

  @Prop({ required: true, unique: true })
  code!: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalCents!: number;

  @Prop({
    required: true,
    enum: ['aguardando_whatsapp', 'confirmado', 'enviado', 'cancelado'],
    default: 'aguardando_whatsapp',
    type: String,
  })
  status!: 'aguardando_whatsapp' | 'confirmado' | 'enviado' | 'cancelado';

  createdAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

@Schema({ collection: 'counters', versionKey: false })
export class Counter {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, default: 0 })
  seq!: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
