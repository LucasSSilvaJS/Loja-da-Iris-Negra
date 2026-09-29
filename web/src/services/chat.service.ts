import type { ChatMessage } from '../types/domain'
import { request } from './http'

export const chatService = {
  list(): Promise<ChatMessage[]> {
    return request<ChatMessage[]>('/chat/messages')
  },
  send(nickname: string, body: string): Promise<ChatMessage> {
    return request<ChatMessage>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ nickname, body }),
    })
  },
}
