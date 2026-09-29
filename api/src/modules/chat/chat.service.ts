import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { cleanText } from '../../common/text';
import { ChatMessageResponseDto, CreateChatMessageDto } from './dto/chat.dto';
import { ChatMessage } from './schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly messages: Model<ChatMessage>,
  ) {}

  async list(): Promise<ChatMessageResponseDto[]> {
    const docs = await this.messages
      .find()
      .sort({ createdAt: -1 })
      .limit(40)
      .lean<Array<ChatMessage & { _id: unknown; createdAt?: Date }>>();

    return docs.reverse().map((doc) => ({
      id: String(doc._id),
      nickname: doc.nickname,
      body: doc.body,
      createdAt: (doc.createdAt ?? new Date()).toISOString(),
    }));
  }

  async create(input: CreateChatMessageDto): Promise<ChatMessageResponseDto> {
    const nickname = cleanText(input.nickname);
    const body = cleanText(input.body);

    if (nickname.length < 2 || body.length < 1) {
      throw new BadRequestException('Apelido e mensagem não podem ficar vazios.');
    }

    const created = await this.messages.create({ nickname, body });
    return {
      id: String(created._id),
      nickname: created.nickname,
      body: created.body,
      createdAt: (created.createdAt ?? new Date()).toISOString(),
    };
  }
}
