import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { User, UserSchema } from "./schemas/user.schema";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }
}
