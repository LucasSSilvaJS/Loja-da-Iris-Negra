import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty({ example: 'luna', maxLength: 24 })
  @IsString()
  @MinLength(2, { message: 'O apelido precisa de pelo menos 2 letras.' })
  @MaxLength(24, { message: 'O apelido passa de 24 letras.' })
  nickname!: string;

  @ApiProperty({ example: 'raven no repeat', maxLength: 280 })
  @IsString()
  @MinLength(1, { message: 'Escreve alguma coisa.' })
  @MaxLength(280, { message: 'A mensagem passa de 280 letras.' })
  body!: string;
}

export class ChatMessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nickname!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  createdAt!: string;
}
