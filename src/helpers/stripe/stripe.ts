import Stripe from 'stripe';
import { StripeConstants } from 'src/constants/stripe';
import { IStripeHelper } from './stripe.interface';

export class StripeHelper {
  private _Stripe: Stripe;

  constructor() {
    this._Stripe = new Stripe(StripeConstants.SecretKey, {
      apiVersion: '2022-08-01',
    });
  }

  public async CreateCustomer(params: IStripeHelper.Customer.Create.Request) {
    const customerExists = await this.CustomerExist({ email: params.email });

    const data: Stripe.CustomerCreateParams = {
      ...params,
      invoice_settings: {
        default_payment_method: params.payment_method,
      },
    };

    const newCustomer = await this._Stripe.customers.create(data);

    return newCustomer;
  }

  public async CustomerExist({ email }: { email: string }) {
    const list = await this._Stripe.customers.list({ email });
    const exist = !!list.data.length;

    return exist;
  }

  public async CreateStripePortal(customer: string) {
    const session = await this._Stripe.billingPortal.sessions.create({
      customer: customer,
      return_url: 'https://google.com/',
    });

    return session.url;
  }

  public async CustomerCreated(customer: Stripe.Account) {
    const options: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      collection_method: 'charge_automatically',
      items: [{ price: StripeConstants.FreePlan, quantity: 1 }],
      payment_behavior: 'allow_incomplete',
      proration_behavior: 'always_invoice',
    };

    const subscription: Stripe.Subscription =
      await this._Stripe.subscriptions.create(options);

    return subscription;
  }
}
