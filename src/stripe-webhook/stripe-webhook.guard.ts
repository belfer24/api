import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { StripeHelper } from '@/helpers/stripe/stripe';

// @Injectable()
// export class StripeWebhookGuard implements CanActivate {
//   constructor(private readonly _StripeHelper: StripeHelper) {}

//   async canActivate(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const signature = request.headers['stripe-signature'];
//     await this._StripeHelper.isStripeCreateEvent({body: request.body, signature})
//     console.log(request);
    
//     return true;
//   }
// }
