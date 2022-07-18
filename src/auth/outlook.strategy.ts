import { PassportStrategy } from "@nestjs/passport";
const Strategy = require('passport-outlook').Strategy;
import { Injectable } from "@nestjs/common";

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class OutlookStrategy extends PassportStrategy(Strategy, 'windowslive') {
  constructor() {
    super({
      clientID: process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.OUTLOOK_SECRET_ID,
      callbackURL: 'http://localhost:3000/auth/redirect',
      scope: ['openid', 'email', 'profile', 'offline_access', 'User.Read'],
      passReqToCallback: true,
    });
  };

  async validate(req, accessToken: string, refreshToken: string, profile: any, done: Function) {
    const user = {
      request: req,
      outlookId: profile._json.account[0].id,
      name: `${profile._json.names[0].first} ${profile._json.names[0].last}`,
      email: profile._json.emails[0].address,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    console.log(req);
    
    done(null, user);
  }
}
