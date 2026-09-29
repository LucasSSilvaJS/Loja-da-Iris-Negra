import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';

class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok' | 'degraded';

  @ApiProperty({ example: 'iris-negra-api' })
  service!: string;
}

@ApiTags('Saúde')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Diz se a API e o MongoDB estão de pé' })
  @ApiOkResponse({ type: HealthResponseDto })
  check(): HealthResponseDto {
    return {
      status: this.connection.readyState === 1 ? 'ok' : 'degraded',
      service: 'iris-negra-api',
    };
  }
}
