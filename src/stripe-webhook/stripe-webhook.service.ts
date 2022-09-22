import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { IStripeWebhook } from './stripe-webhook.interface';
import { StripeConstants } from '@/constants/stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookService {
  constructor(
    @InjectModel(User.name)
    private readonly UserCollection: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper,
  ) {}
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
    const isPremium = false;

    if (!customer) throw new Error('Stripe customer not found!');

    const customerEmail = customer.email as string;

    await this._StripeHelper.setFreePlan(customerId);
    await this._SetNewLimits({isPremium, customerId, customerEmail});
  }

  async HandleWebhookInvoiceSucceeded(
    event: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    const invoice = event.data.object;

    const customerId = invoice.customer as string;
    const customerEmail = invoice.customer_email as string;
    const customerPlan = invoice.lines.data[0].plan;
    const isPremium = true;

    if (!customerPlan) throw new Error('Customer plan not found!');

    const customerPlanId = customerPlan.id;

    if (customerPlanId === StripeConstants.PremiumPlanPriceId) {
      await this._SetNewLimits({isPremium, customerId, customerEmail});
    }
  }

  async HandleWebhookInvoiceFailed(
    event: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    const invoice = event.data.object;

    const customerId = invoice.customer as string;
    const customerEmail = invoice.customer_email;
    if (!customerEmail) {
      throw Error('Email not found!');
    }
    const isPremium = false;

    await this._SetNewLimits({
      isPremium,
      customerId,
      customerEmail,
    });
  }

  private async _SetNewLimits(params: IStripeWebhook.Limits.Params) {
    const { isPremium, customerId, customerEmail } = params;
    const dailyLimit = isPremium ? 2000 : 200;
    await this.UserCollection.findOneAndUpdate(
      {
        email: customerEmail,
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
