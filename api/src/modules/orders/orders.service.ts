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
import { buildOrderMessage, buildWhatsappUrl, formatCents } from './order-message';
import { Counter, Order } from './schemas/order.schema';

type ReservedPiece = {
  productSlug: string;
  name: string;
  size: string;
  color: string;
  madeToOrder: boolean;
};

type ReservedItem = {
  productSlug: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceCents: number;
  madeToOrder: boolean;
  note: string;
  bundle: boolean;
  contents: ReservedPiece[];
};

type StockHit = {
  slug: string;
  name: string;
  quantity: number;
};

function pieceLabel(name: string, size: string, color: string): string {
  const parts = [size, color].filter((part) => part && part !== '\u00fanico');
  return parts.length ? `${name} (${parts.join(', ')})` : name;
}

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
      boxSize: input.boxSize,
    });

    const created = await this.orders.create({
      publicId: randomBytes(9).toString('base64url'),
      code,
      items: resolved.map((item) => ({
        productSlug: item.productSlug,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        note: item.note,
        contents: item.contents.map((piece) => ({
          productSlug: piece.productSlug,
          size: piece.size,
          color: piece.color,
        })),
      })),
      totalCents,
      boxSize: input.boxSize,
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
      boxSize: doc.boxSize,
    });

    return this.toResponse(doc, message);
  }

  private mergeItems(items: OrderItemDto[]): OrderItemDto[] {
    const merged = new Map<string, OrderItemDto>();

    for (const item of items) {
      const key = [
        item.productSlug,
        item.size,
        item.color ?? '',
        (item.contents ?? [])
          .map((piece) => `${piece.productSlug}:${piece.size}:${piece.color ?? ''}`)
          .slice()
          .sort()
          .join('|'),
      ].join(':');
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
          `${product.name} n\u00e3o tem o tamanho ${item.size}.`,
        );
      }
      const colors = product.colors ?? [];
      let color = item.color?.trim() ?? '';
      if (colors.length > 0 && !color) color = colors[0] ?? '';
      if (colors.length > 0 && color && !colors.includes(color)) {
        throw new BadRequestException(
          `${product.name} n\u00e3o tem a cor ${color}.`,
        );
      }
      const packed = await this.resolvePieces(product, item.contents);
      resolved.push({
        productSlug: product.slug,
        name: product.name,
        size: item.size,
        color: colors.length > 0 ? color : '',
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
        madeToOrder: product.madeToOrder,
        note: packed.note,
        bundle: packed.pieces.length > 0,
        contents: packed.pieces,
      });
    }

    return resolved;
  }

  private async resolvePieces(
    box: { name: string; categorySlug: string; priceCents: number },
    contents: OrderItemDto['contents'],
  ): Promise<{ pieces: ReservedPiece[]; note: string }> {
    if (!contents?.length) return { pieces: [], note: '' };
    if (box.categorySlug !== 'box') {
      throw new BadRequestException('S\u00f3 a caixa leva uma lista de pe\u00e7as.');
    }
    const seen = new Set<string>();
    const pieces: ReservedPiece[] = [];
    const labels: string[] = [];
    let sum = 0;
    for (const piece of contents) {
      if (seen.has(piece.productSlug)) {
        throw new BadRequestException('A caixa n\u00e3o repete pe\u00e7a.');
      }
      seen.add(piece.productSlug);
      const product = await this.products.findOne({ slug: piece.productSlug }).lean();
      if (!product) {
        throw new NotFoundException(
          `A pe\u00e7a "${piece.productSlug}" n\u00e3o est\u00e1 no cat\u00e1logo.`,
        );
      }
      if (product.categorySlug === 'box') {
        throw new BadRequestException('A caixa n\u00e3o inclui outra caixa.');
      }
      if (!product.sizes.includes(piece.size)) {
        throw new BadRequestException(
          `${product.name} n\u00e3o tem o tamanho ${piece.size}.`,
        );
      }
      const colors = product.colors ?? [];
      let color = piece.color?.trim() ?? '';
      if (colors.length > 0 && !color) color = colors[0] ?? '';
      if (colors.length > 0 && color && !colors.includes(color)) {
        throw new BadRequestException(
          `${product.name} n\u00e3o tem a cor ${color}.`,
        );
      }
      pieces.push({
        productSlug: product.slug,
        name: product.name,
        size: piece.size,
        color: colors.length > 0 ? color : '',
        madeToOrder: product.madeToOrder,
      });
      labels.push(
        `${pieceLabel(product.name, piece.size, colors.length > 0 ? color : '')} \u2014 ${formatCents(product.priceCents)}`,
      );
      sum += product.priceCents;
    }

    const max = box.priceCents + Math.floor(box.priceCents / 10);
    if (sum < box.priceCents || sum > max) {
      throw new BadRequestException(
        'O valor das pe\u00e7as ficou fora do pre\u00e7o da caixa.',
      );
    }

    return {
      pieces,
      note: [
        ...labels,
        `Soma das pe\u00e7as: ${formatCents(sum)}.`,
        `Valor cobrado: ${formatCents(box.priceCents)}, o pre\u00e7o da caixa.`,
        `As pe\u00e7as ficam entre ${formatCents(box.priceCents)} e ${formatCents(max)} (10% a mais).`,
      ].join('\n'),
    };
  }

  private async reserve(items: ReservedItem[]): Promise<void> {
    const taken: StockHit[] = [];
    const hits = this.stockHits(items);

    try {
      for (const hit of hits) {
        const updated = await this.products.findOneAndUpdate(
          { slug: hit.slug, stock: { $gte: hit.quantity } },
          { $inc: { stock: -hit.quantity } },
        );

        if (!updated) {
          throw new BadRequestException(
            `N\u00e3o tenho ${hit.quantity} de ${hit.name} agora.`,
          );
        }

        taken.push(hit);
      }
    } catch (error) {
      await this.release(taken);
      throw error;
    }
  }

  private stockHits(items: ReservedItem[]): StockHit[] {
    const hits = new Map<string, StockHit>();
    const add = (slug: string, name: string, quantity: number, madeToOrder: boolean) => {
      if (madeToOrder || quantity <= 0) return;
      const current = hits.get(slug);
      if (current) current.quantity += quantity;
      else hits.set(slug, { slug, name, quantity });
    };

    for (const item of items) {
      if (!item.bundle) add(item.productSlug, item.name, item.quantity, item.madeToOrder);
      for (const piece of item.contents) {
        add(piece.productSlug, piece.name, item.quantity, piece.madeToOrder);
      }
    }

    return [...hits.values()];
  }

  private async release(items: StockHit[]): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.products.updateOne(
          { slug: item.slug },
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
      boxSize?: Order['boxSize'];
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
        color: item.color || undefined,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        note: item.note || undefined,
        contents: item.contents?.length
          ? item.contents.map((piece) => ({
              productSlug: piece.productSlug,
              size: piece.size,
              color: piece.color || undefined,
            }))
          : undefined,
      })),
      totalCents: doc.totalCents,
      boxSize: doc.boxSize,
      status: doc.status,
      whatsappUrl: buildWhatsappUrl(
        this.config.get<string>('WHATSAPP_NUMBER'),
        message,
      ),
      createdAt: (doc.createdAt ?? new Date()).toISOString(),
    };
  }
}
