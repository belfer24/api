import { Controller, Request, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/')
  async getHello() {
    return this.appService.getHello()
  }
}
