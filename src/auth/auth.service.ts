import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  outlookLogin(req) {
    if (!req.user) {
      return 'No user from outlook'
    }

    return {
      message: 'User information from outlook',
      user: req.user
    }
  }
}
