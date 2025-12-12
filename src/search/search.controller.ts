import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string) {
    try {
      return await this.searchService.searchAll(q);
    } catch (error) {
      console.error("SearchController Error:", error);
      return { users: [], posts: [], tags: [] }; // safe fallback
    }
  }
}
