import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetMeDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Добавить гарду для верификации токена
  @Get('me')
  async getUser(@Query() query: GetMeDto) {
    const user = await this.usersService.findUser(query.refreshToken);
    
    return user;
  }
}
