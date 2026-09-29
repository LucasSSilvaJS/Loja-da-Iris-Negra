import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product.response';
import { ProductsService } from './products.service';

@ApiTags('Produtos')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista o catálogo',
    description:
      'Filtra por tipo de produto ou pelos destaques da capa. Sem filtro, devolve a loja inteira.',
  })
  @ApiQuery({ name: 'category', required: false, example: 'eva' })
  @ApiQuery({ name: 'featured', required: false, example: 'true' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  list(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ): Promise<ProductResponseDto[]> {
    return this.products.list(category, featured === 'true');
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Detalha uma peça' })
  @ApiOkResponse({ type: ProductResponseDto })
  findOne(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.products.findBySlug(slug);
  }
}
