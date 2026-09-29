import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Pedidos')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Registra um pedido',
    description:
      'Reserva o estoque das peças prontas, grava o pedido e devolve o link do WhatsApp para a loja combinar pagamento e entrega. Peças da Eva não baixam estoque: são sob encomenda.',
  })
  @ApiCreatedResponse({ type: OrderResponseDto })
  create(@Body() body: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orders.create(body);
  }

  @Get(':publicId')
  @ApiOperation({
    summary: 'Consulta um pedido pelo identificador da URL',
    description:
      'O código humano (IRN-0001) aparece na resposta. A URL usa um identificador opaco para o pedido não ficar enumerável.',
  })
  @ApiOkResponse({ type: OrderResponseDto })
  findOne(@Param('publicId') publicId: string): Promise<OrderResponseDto> {
    return this.orders.findByPublicId(publicId);
  }
}
