import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category.response';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista os tipos de produto',
    description:
      'Prateleiras da loja: camisas, bon\u00e9s, joias, pel\u00facias, tabacaria, sex shop, box e Eva.',
  })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  list(): Promise<CategoryResponseDto[]> {
    return this.categories.list();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Detalha um tipo de produto' })
  @ApiOkResponse({ type: CategoryResponseDto })
  findOne(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return this.categories.findBySlug(slug);
  }
}
