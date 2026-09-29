import type { Track } from '../types/domain'
import { request } from './http'

export const playlistService = {
  list(): Promise<Track[]> {
    return request<Track[]>('/playlist')
  },
}
