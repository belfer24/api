import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('getOne')
  async getUser(@Body() body: {email: string}) {
    const email = body.email;
    const user = await this.usersService.findUser(email);
    
    return user;
  }

  @Get('reset-limits')
  async resetDailySendLimits() {
    return this.usersService.resetDailySendLimits();
  }
}
