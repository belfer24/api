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

  async HandleWebhookSubscriptionDeleted(event: IStripeWebhook.Event<Stripe.Subscription>) {
    const customerId = event.data.object.customer;
    const customer = await this._StripeHelper.GetCustomer(customerId as string);
    const customerEmail = customer?.email;

    await this._StripeHelper.setFreePlan(customerId as string);
    await this._setNewLimits(false, customerId as string, customerEmail as string)
  }

  async HandleWebhookInvoiceSucceeded(event: IStripeWebhook.Event<Stripe.Invoice>) {
    const customerId = event.data.object.customer;
    const customerEmail = event.data.object.customer_email;
    const customerPlan = event.data.object.lines.data[0].plan?.id;

    if (customerPlan === StripeConstants.PremiumPlan) {
      await this._setNewLimits(true, customerId as string, customerEmail as string)
    }
  }

  async HandleWebhookInvoiceFailed(event: IStripeWebhook.Event<Stripe.Invoice>) {
    const customerId = event.data.object.customer;
    const customerEmail = event.data.object.customer_email;

    await this._setNewLimits(false, customerId as string, customerEmail as string)
  }

  private async _setNewLimits(isPremium: boolean, customerId: string, email: string) {
    const dailyLimit = isPremium ? 2000 : 200;
    await this.userModel.findOneAndUpdate(
      {
        email
      },
      {
        billing: {
          paid: isPremium,
          stripe: {
            customerId
          },
          dailyLimit,
        },
      },
    );
  }
}
