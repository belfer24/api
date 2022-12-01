import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StripeHelper } from '@/helpers/stripe/stripe';

@Injectable()
export class StripeGuard implements CanActivate {
  constructor(private readonly _StripeHelper: StripeHelper) {}

  //TODO: что это?
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
