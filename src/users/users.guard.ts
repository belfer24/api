import { OutlookHelper } from '@/helpers/outlook/outlook';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private readonly _OutlookHelper: OutlookHelper) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers.authorization;
    
    try {
      await this._OutlookHelper.checkRefreshToken(refreshToken);
      return true;
    } catch (error) {
      return false
    }
  }
}
