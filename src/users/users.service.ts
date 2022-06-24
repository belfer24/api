import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserDto } from "./dto/user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async createUser(createUserDto: UserDto) {
    if (await this.userModel.findOne({ email: createUserDto.email }) != null) {
      return console.log(`Email ${createUserDto.email} already exists.`);
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const newUser = {
      email: createUserDto.email,
      password: hashedPassword,
    }
    const createdUser = this.userModel.create(newUser);
    return createdUser;
  }

  async findUser(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email });
  }
}
