import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'camiseta-raven' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'A peça informada não é válida.' })
  productSlug!: string;

  @ApiProperty({ example: 'M' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  size!: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'A quantidade mínima é 1.' })
  @Max(10, { message: 'O máximo por peça é 10.' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'A sacola está vazia.' })
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export class OrderItemResponseDto {
  @ApiProperty()
  productSlug!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  size!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  unitPriceCents!: number;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Identificador opaco usado na URL do pedido' })
  publicId!: string;

  @ApiProperty({ example: 'IRN-0001' })
  code!: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiProperty()
  totalCents!: number;

  @ApiProperty({
    enum: ['aguardando_whatsapp', 'confirmado', 'enviado', 'cancelado'],
  })
  status!: string;

  @ApiProperty({
    nullable: true,
    description:
      'Link pronto para o WhatsApp da loja. Null se WHATSAPP_NUMBER não estiver configurado.',
  })
  whatsappUrl!: string | null;

  @ApiProperty()
  createdAt!: string;
}
