const CACHE_MS = 6 * 60 * 60 * 1000;

type ItunesSong = {
  artistName?: string;
  trackName?: string;
  previewUrl?: string;
};

type CacheEntry = {
  url: string | null;
  expires: number;
};

const cache = new Map<string, CacheEntry>();

export async function findPreviewUrl(artist: string, title: string): Promise<string | null> {
  const key = `${artist}\n${title}`.toLowerCase();
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.url;

  const url = await requestPreview(artist, title);
  cache.set(key, { url, expires: Date.now() + CACHE_MS });
  return url;
}

async function requestPreview(artist: string, title: string, attempt = 0): Promise<string | null> {
  const term = encodeURIComponent(`${artist} ${title}`);
  const endpoint = `https://itunes.apple.com/search?term=${term}&entity=song&limit=8`;
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) {
    if (attempt < 1 && (response.status === 429 || response.status === 403 || response.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return requestPreview(artist, title, attempt + 1);
    }
    throw new Error('A prévia não respondeu.');
  }
  const body = (await response.json()) as { results?: ItunesSong[] };
  const ranked = (body.results ?? [])
    .map((song) => ({ song, points: score(song, artist, title) }))
    .filter((entry) => entry.points >= 4)
    .sort((a, b) => b.points - a.points);
  return ranked[0]?.song.previewUrl ?? null;
}

function score(song: ItunesSong, artist: string, title: string): number {
  if (!song.previewUrl || !song.artistName || !song.trackName) return -1;
  const wantArtist = compact(artist);
  const wantTitle = compact(title);
  const gotArtist = compact(song.artistName);
  const gotTitle = compact(song.trackName);
  if (!(gotArtist.includes(wantArtist) || wantArtist.includes(gotArtist))) return -1;
  let points = 2;
  if (gotTitle === wantTitle) points += 4;
  else if (gotTitle.includes(wantTitle) || wantTitle.includes(gotTitle)) points += 2;
  return points;
}

function compact(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}
