import { ApiProperty } from '@nestjs/swagger';

export class TrackResponseDto {
  @ApiProperty({ example: 'In the End' })
  title!: string;

  @ApiProperty({ example: 'Linkin Park' })
  artist!: string;

  @ApiProperty({ example: 'Hybrid Theory' })
  album!: string;

  @ApiProperty({ example: '03:36' })
  durationLabel!: string;

  @ApiProperty({ nullable: true, example: 'eVTXPUF4Oz4' })
  youtubeId!: string | null;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=eVTXPUF4Oz4' })
  externalUrl!: string;

  @ApiProperty({
    nullable: true,
    description: 'Prévia de áudio oficial da iTunes Search API.',
    example: 'https://audio-ssl.itunes.apple.com/itunes-assets/preview.m4a',
  })
  previewUrl!: string | null;

  @ApiProperty({ example: 3 })
  sortOrder!: number;
}
