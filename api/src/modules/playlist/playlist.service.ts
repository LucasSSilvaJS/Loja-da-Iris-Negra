import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrackResponseDto } from './dto/track.response';
import { findPreviewUrl } from './itunes-preview';
import { Track } from './schemas/track.schema';

async function mapPool<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index]);
      await new Promise((resolve) => setTimeout(resolve, 160));
    }
  });
  await Promise.all(workers);
  return results;
}

@Injectable()
export class PlaylistService {
  constructor(@InjectModel(Track.name) private readonly tracks: Model<Track>) {}

  async list(): Promise<TrackResponseDto[]> {
    const docs = await this.tracks.find().sort({ sortOrder: 1 }).lean();
    const previews = await mapPool(docs, 4, (doc) =>
      findPreviewUrl(doc.artist, doc.title).catch(() => null),
    );
    return docs.map((doc, index) => ({
      title: doc.title,
      artist: doc.artist,
      album: doc.album,
      durationLabel: doc.durationLabel,
      youtubeId: doc.youtubeId,
      externalUrl: doc.externalUrl,
      previewUrl: previews[index] ?? null,
      sortOrder: doc.sortOrder,
    }));
  }
}
