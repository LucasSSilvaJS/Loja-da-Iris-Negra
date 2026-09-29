import { ApiProperty } from '@nestjs/swagger';
import { MOTIFS } from '../schemas/product.schema';

export class ProductResponseDto {
  @ApiProperty({ example: 'camiseta-raven' })
  slug!: string;

  @ApiProperty({ example: 'Camiseta Raven' })
  name!: string;

  @ApiProperty()
  summary!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ example: 8900, description: 'Preço em centavos' })
  priceCents!: number;

  @ApiProperty({ example: 'camisas' })
  categorySlug!: string;

  @ApiProperty({ enum: ['iris-negra', 'eva'] })
  maker!: 'iris-negra' | 'eva';

  @ApiProperty({ enum: MOTIFS })
  motif!: (typeof MOTIFS)[number];

  @ApiProperty({ example: '/produtos/camiseta-raven.png' })
  image!: string;

  @ApiProperty({ type: [String], example: ['P', 'M', 'G'] })
  sizes!: string[];

  @ApiProperty({ example: 12 })
  stock!: number;

  @ApiProperty({ description: 'Peça da Eva, produzida depois do pedido' })
  madeToOrder!: boolean;

  @ApiProperty()
  featured!: boolean;
}
