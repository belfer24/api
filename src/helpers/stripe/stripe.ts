import Stripe from 'stripe';
import { StripeConstants } from '@/constants/stripe';
import { IStripeHelper } from './stripe.interface';

export class StripeHelper {
  private _Stripe: Stripe;

  constructor() {
    if(StripeConstants.SecretKey) {
      this._Stripe = new Stripe(StripeConstants.SecretKey, {
        apiVersion: '2022-08-01',
      });
    } else {
      throw Error('Stripe secret key is not valid!')
    }
  }

  public async CreateCustomer(params: IStripeHelper.Customer.Create.Request) {
    const data: Stripe.CustomerCreateParams = {
      ...params,
      invoice_settings: {
        default_payment_method: params.payment_method,
      },
    };

    const newCustomer = await this._Stripe.customers.create(data);

    return newCustomer;
  }

  public async GetCustomerById(id: string) {
    const customer = await this._Stripe.customers.retrieve(id);

    if (customer.deleted !== true) {
      return customer;
    }

    return undefined;
  }

  public async CreateStripePortalUrl(customerId: string, returnUrl: string) {
    const session = await this._Stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  public async SetFreePlan(customerId: string) {
    const options: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      collection_method: 'charge_automatically',
      items: [{ price: StripeConstants.FreePlanPriceId, quantity: 1 }],
      payment_behavior: 'allow_incomplete',
      proration_behavior: 'always_invoice',
    };

    const subscription: Stripe.Subscription =
      await this._Stripe.subscriptions.create(options);

    return subscription;
  }
}
