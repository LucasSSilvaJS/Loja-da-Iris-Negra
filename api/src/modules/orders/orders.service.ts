import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import {
  CreateOrderDto,
  OrderItemDto,
  OrderResponseDto,
} from './dto/order.dto';
import { buildOrderMessage, buildWhatsappUrl } from './order-message';
import { Counter, Order } from './schemas/order.schema';

type ReservedItem = {
  productSlug: string;
  name: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
  madeToOrder: boolean;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orders: Model<Order>,
    @InjectModel(Counter.name) private readonly counters: Model<Counter>,
    @InjectModel(Product.name) private readonly products: Model<Product>,
    private readonly config: ConfigService,
  ) {}

  async create(input: CreateOrderDto): Promise<OrderResponseDto> {
    const items = this.mergeItems(input.items);
    const resolved = await this.resolve(items);
    await this.reserve(resolved);

    const code = await this.nextCode();
    const totalCents = resolved.reduce(
      (sum, item) => sum + item.unitPriceCents * item.quantity,
      0,
    );
    const message = buildOrderMessage({
      code,
      items: resolved,
      totalCents,
    });

    const created = await this.orders.create({
      publicId: randomBytes(9).toString('base64url'),
      code,
      items: resolved.map((item) => ({
        productSlug: item.productSlug,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      })),
      totalCents,
      status: 'aguardando_whatsapp',
    });

    return this.toResponse(created, message);
  }

  async findByPublicId(publicId: string): Promise<OrderResponseDto> {
    const doc = await this.orders.findOne({ publicId }).lean();
    if (!doc) {
      throw new NotFoundException('Não achei esse pedido.');
    }

    const message = buildOrderMessage({
      code: doc.code,
      items: doc.items,
      totalCents: doc.totalCents,
    });

    return this.toResponse(doc, message);
  }

  private mergeItems(items: OrderItemDto[]): OrderItemDto[] {
    const merged = new Map<string, OrderItemDto>();

    for (const item of items) {
      const key = `${item.productSlug}:${item.size}`;
      const current = merged.get(key);
      if (!current) {
        merged.set(key, { ...item });
        continue;
      }
      current.quantity += item.quantity;
    }

    for (const item of merged.values()) {
      if (item.quantity > 10) {
        throw new BadRequestException('O máximo por peça é 10.');
      }
    }

    return [...merged.values()];
  }

  private async resolve(items: OrderItemDto[]): Promise<ReservedItem[]> {
    const resolved: ReservedItem[] = [];

    for (const item of items) {
      const product = await this.products.findOne({ slug: item.productSlug }).lean();
      if (!product) {
        throw new NotFoundException(
          `A peça "${item.productSlug}" não está no catálogo.`,
        );
      }
      if (!product.sizes.includes(item.size)) {
        throw new BadRequestException(
          `${product.name} não tem o tamanho ${item.size}.`,
        );
      }
      resolved.push({
        productSlug: product.slug,
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
        madeToOrder: product.madeToOrder,
      });
    }

    return resolved;
  }

  private async reserve(items: ReservedItem[]): Promise<void> {
    const taken: ReservedItem[] = [];

    try {
      for (const item of items) {
        if (item.madeToOrder) continue;

        const updated = await this.products.findOneAndUpdate(
          { slug: item.productSlug, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
        );

        if (!updated) {
          throw new BadRequestException(
            `Não tenho ${item.quantity} de ${item.name} agora.`,
          );
        }

        taken.push(item);
      }
    } catch (error) {
      await this.release(taken);
      throw error;
    }
  }

  private async release(items: ReservedItem[]): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.products.updateOne(
          { slug: item.productSlug },
          { $inc: { stock: item.quantity } },
        ),
      ),
    );
  }

  private async nextCode(): Promise<string> {
    const counter = await this.counters.findOneAndUpdate(
      { name: 'order' },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' },
    );

    const seq = counter?.seq ?? 1;
    return `IRN-${String(seq).padStart(4, '0')}`;
  }

  private toResponse(
    doc: {
      publicId: string;
      code: string;
      items: Order['items'];
      totalCents: number;
      status: Order['status'];
      createdAt?: Date;
    },
    message: string,
  ): OrderResponseDto {
    return {
      publicId: doc.publicId,
      code: doc.code,
      items: doc.items.map((item) => ({
        productSlug: item.productSlug,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      })),
      totalCents: doc.totalCents,
      status: doc.status,
      whatsappUrl: buildWhatsappUrl(
        this.config.get<string>('WHATSAPP_NUMBER'),
        message,
      ),
      createdAt: (doc.createdAt ?? new Date()).toISOString(),
    };
  }
}
