import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('getOne')
  async getUser(@Body() body: {email: string}) {
    const email = body.email;

    return this.usersService.findUser(email);
  }
}
