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

  async createStripeProtal(refreshToken: string) {
    // const user = await this.UsersCollection.findOne({ email }).exec();
    const user = await this.userModel.findOne({ refreshToken }).exec();

    if (user) {
      const portalLink = await this._StripeHelper.CreateStripePortalUrl(
        user.billing.stripe.customerId,
      );

      return portalLink;
    } else {
      throw Error('User not found!');
    }
  }

  async HandleWebhookCustomerCreated(
    event: IStripeWebhook.Event<Stripe.Customer>,
  ) {
    return this._StripeHelper.setFreePlan(event.data.object.id);
  }

  async HandleWebhookSubscriptionDeleted(
    event: IStripeWebhook.Event<Stripe.Subscription>,
  ) {
    const subscription = event.data.object;

    const customerId = subscription.customer as string;
    const customer = await this._StripeHelper.GetCustomerById(customerId);

    if (!customer) throw new Error('ERROR');

    const customerEmail = customer.email as string;

    await this._StripeHelper.setFreePlan(customerId);
    await this._SetNewLimits(false, customerId, customerEmail);
  }

  async HandleWebhookInvoiceSucceeded(
    event: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    const invoice = event.data.object;

    const customerId = invoice.customer as string;
    const customerEmail = invoice.customer_email as string;
    const customerPlan = invoice.lines.data[0].plan;

    if (!customerPlan) throw new Error('ERROR');

    const customerPlanId = customerPlan.id;

    if (customerPlanId === StripeConstants.PremiumPlanPriceId) {
      await this._SetNewLimits(true, customerId, customerEmail);
    }
  }

  async HandleWebhookInvoiceFailed(
    event: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    const invoice = event.data.object;

    const customerId = invoice.customer;
    const customerEmail = invoice.customer_email;

    await this._SetNewLimits(
      false,
      customerId as string,
      customerEmail as string,
    );
  }

  private async _SetNewLimits(
    isPremium: boolean,
    customerId: string,
    email: string,
  ) {
    // Функция всегда принимает только 1 аргумент, используй деструктуризацию объекта
    const dailyLimit = isPremium ? 2000 : 200;
    await this.userModel.findOneAndUpdate(
      {
        email,
      },
      {
        billing: {
          paid: isPremium,
          stripe: {
            customerId,
          },
          dailyLimit,
        },
      },
    );
  }
}
