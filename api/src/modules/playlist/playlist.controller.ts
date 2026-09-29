import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrackResponseDto } from './dto/track.response';
import { PlaylistService } from './playlist.service';

@ApiTags('Playlist')
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlist: PlaylistService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista a trilha da loja',
    description:
      'Faixas de nu metal e rock dos anos 2000. previewUrl é a prévia oficial da iTunes Search API e toca no site.',
  })
  @ApiOkResponse({ type: TrackResponseDto, isArray: true })
  list(): Promise<TrackResponseDto[]> {
    return this.playlist.list();
  }
}
