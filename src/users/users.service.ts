import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findUser(refreshToken: string): Promise<User | undefined | null> {
    return this.userModel.findOne({ refreshToken });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    return this.userModel.updateMany(
      { sentMessagesToday: { $gt: 0 } },
      { sentMessagesToday: 0 },
    );
  }
}
