import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { GetMeDto } from './dto/user.dto';
import { UsersGuard } from './users.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(UsersGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Headers() headers: GetMeDto) {
    const user = await this.usersService.findUser(headers.authorization);
    
    return user;
  }
}
