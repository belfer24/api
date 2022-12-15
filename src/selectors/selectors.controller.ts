import { Controller, Get } from '@nestjs/common';
import { SelectorsService } from './selectors.service';

@Controller('selectors')
export class SelectorsController {
  constructor(private selectorsServise: SelectorsService) {}

  @Get('get')
  async GetSelectors() {
    return this.selectorsServise.GetSelectors();
  }
}
