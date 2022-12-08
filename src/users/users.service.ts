import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { IUsers } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserCollection: Model<UserDocument>,
  ) {}

  async findUser(params: IUsers.Service.FindUser.Body) {
    const { authorization } = params;
    const user = await this.UserCollection.findOne({ refreshToken: authorization });

    return user;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const updatedCollection = await this.UserCollection.updateMany(
      { sentMessagesToday: { $gt: 0 } },
      { sentMessagesToday: 0 },
    );

    return updatedCollection;
  }
}
