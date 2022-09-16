import { Body, Controller, Get, Post } from '@nestjs/common';
import { Headers } from '@nestjs/common/decorators';
import { ResetLimitsDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('get-one')
  async getUser(@Body() body: UserDto) {
    const email = body.email;
    const user = await this.usersService.findUser(email);
    
    return user;
  }

  @Post('reset-limits')
  async resetDailySendLimits(@Headers() headers: ResetLimitsDto) {
    return this.usersService.resetDailySendLimits(headers.authorization);
  }
}
