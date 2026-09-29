import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChatService } from './chat.service';
import { ChatMessageResponseDto, CreateChatMessageDto } from './dto/chat.dto';

@ApiTags('Chat')
@Controller('chat/messages')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  @ApiOperation({
    summary: 'Lê o shoutbox',
    description: 'As 40 mensagens mais recentes, da mais antiga para a mais nova.',
  })
  @ApiOkResponse({ type: ChatMessageResponseDto, isArray: true })
  list(): Promise<ChatMessageResponseDto[]> {
    return this.chat.list();
  }

  @Post()
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Publica no shoutbox',
    description:
      'Chat simples, no espírito dos guestbooks de site antigo. Não envie telefone nem endereço.',
  })
  @ApiCreatedResponse({ type: ChatMessageResponseDto })
  create(@Body() body: CreateChatMessageDto): Promise<ChatMessageResponseDto> {
    return this.chat.create(body);
  }
}
