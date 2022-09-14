import { Injectable } from '@nestjs/common';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IStripeWebhook } from './stripe.interface';
import { StripeConstants } from '@/constants/stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async createStripeProtal(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      const portalLink = await this._StripeHelper.CreateStripePortal(
        user.billing.stripe.customerId,
      );

      return portalLink;
    } else {
      throw Error('User not found!');
    }
  }

  async HandleWebhookCustomerCreated(event: IStripeWebhook.Event) {
    const customerInfo = event.data.object as Stripe.Charge;

    await this._StripeHelper.HandleWebhookCustomerCreated(customerInfo);
  }

  async setFreePlan(event: IStripeWebhook.Event) {
    await this.updatePremiumStatus(event, false);

    return this._StripeHelper.SetDefaultSubscritpion(event);
  }

  async updatePremiumStatus(event: IStripeWebhook.Event, isPremium: boolean) {
    const subscriptionData = event.data.object as Stripe.Charge;
    //@ts-ignore
    const userPlanId = subscriptionData.items.data.plan.id;
    const dailyLimit = isPremium ? 2000 : 200;

    if (userPlanId === StripeConstants.PremiumPlan) {
      await this.userModel.findOneAndUpdate(
        {
          billing: {
            stripe: {
              customerId: subscriptionData.customer,
            },
          },
        },
        {
          billing: {
            paid: isPremium,
            dailyLimit,
          },
        },
      );
    }
  }
}
