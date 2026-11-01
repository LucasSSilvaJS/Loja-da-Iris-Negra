import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class BoxPieceDto {
  @ApiProperty({ example: 'camisa-iris' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'A pe\u00e7a informada n\u00e3o \u00e9 v\u00e1lida.' })
  productSlug!: string;

  @ApiProperty({ example: 'M' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  size!: string;

  @ApiProperty({ required: false, example: 'preto' })
  @IsOptional()
  @IsString()
  @MaxLength(24)
  color?: string;
}

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
  @Max(10, { message: 'O m\u00e1ximo por pe\u00e7a \u00e9 10.' })
  quantity!: number;

  @ApiProperty({ required: false, example: 'preto' })
  @IsOptional()
  @IsString()
  @MaxLength(24)
  color?: string;

  @ApiProperty({ required: false, type: [BoxPieceDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(32)
  @ValidateNested({ each: true })
  @Type(() => BoxPieceDto)
  contents?: BoxPieceDto[];
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'A sacola está vazia.' })
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ required: false, enum: ['P', 'M', 'G'] })
  @IsOptional()
  @IsIn(['P', 'M', 'G'])
  boxSize?: 'P' | 'M' | 'G';
}

export class OrderItemResponseDto {
  @ApiProperty()
  productSlug!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  size!: string;

  @ApiProperty({ required: false })
  color?: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  unitPriceCents!: number;

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty({ required: false, type: [BoxPieceDto] })
  contents?: BoxPieceDto[];
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

  @ApiProperty({ required: false, enum: ['P', 'M', 'G'] })
  boxSize?: 'P' | 'M' | 'G';

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
