import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 'camisas' })
  slug!: string;

  @ApiProperty({ example: 'Camisas' })
  name!: string;

  @ApiProperty({ example: 'logo da banda na malha' })
  blurb!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: ['banda', 'eva'] })
  kind!: 'banda' | 'eva';

  @ApiProperty({ example: 1 })
  sortOrder!: number;
}
