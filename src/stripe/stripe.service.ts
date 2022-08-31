import { Injectable } from '@nestjs/common';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IStripeWebhook } from './stripe.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async createStripeProtal(customer: { email: string }) {
    const user = await this.userModel.findOne({ email: customer.email }).exec();

    if (user) {
      const portalLink = await this._StripeHelper.CreateStripePortal(
        user.billing.stripe.customerId,
      );

      return portalLink;
    }
  }

  async customerCreated(
    customer: IStripeWebhook.Service.CustomerCreate.Params,
  ) {
    const data = customer.data.object;

    await this._StripeHelper.CustomerCreated(data);
  }

  async setFreePlan(data: IStripeWebhook.Service.SubscriptionUpdated.Params) {
    await this.updatePremiumStatus(data, false);
    
    return this._StripeHelper.SetDefaultSubscritpion(data);
  }

  async updatePremiumStatus(
    body: IStripeWebhook.Service.SubscriptionUpdated.Params,
    isPremium?: boolean,
  ) {
    const subscriptionData = body.data.object;
    const dailyLimit = isPremium ? 2000 : 200;

    await this.userModel.findOneAndUpdate(
      { 'billing.stripe.customerId': subscriptionData.customer },
      {
        'billing.paid': isPremium,
        'billing.dailyLimit': dailyLimit,
      },
    );
  }
}
