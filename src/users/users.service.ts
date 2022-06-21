import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserDto } from "./dto/user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async createUser(createUserDto: UserDto) {
    if (await this.userModel.findOne({ email: createUserDto.email }) != null) {
      return console.log(`Email ${createUserDto.email} already exists.`);
    }

    const createdUser = this.userModel.create(createUserDto);
    return createdUser;
  }
}
