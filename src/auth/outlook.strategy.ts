import { PassportStrategy } from "@nestjs/passport";
const Strategy = require('passport-outlook').Strategy;
import { Injectable } from "@nestjs/common";

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class OutlookStrategy extends PassportStrategy(Strategy, 'outlook') {
  constructor() {
    super({
      clientID: process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.OUTLOOK_SECRET_ID,
      callbackURL: 'http://localhost:3000/auth/request',
      scope: ['openid', 'email', 'profile'],
    });
  };

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const user = {
      outlookId: profile.id,
      name: profile.name,
      email: profile.EmailAddress,
      accessToken: accessToken,
    };

    done(null, user);
  }
}
