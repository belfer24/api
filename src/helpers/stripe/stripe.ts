import Stripe from "stripe";
import { StripeConstants } from "src/constants/stripe";

export class StripeHelper {
  private _Stripe: Stripe;

  constructor() {
    this._Stripe = new Stripe(StripeConstants.SecretKey, {
      apiVersion: '2022-08-01',
    })
  }

  public async CreateCustomer(params) {
    const customerExists = await this.CustomerExist({ email: params.email })

    const data: Stripe.CustomerCreateParams = {
      ...params,
      invoice_settings: {
        default_payment_method: params.payment_method,
      }
    }

    const newCustomer = await this._Stripe.customers.create(data);

    return newCustomer;
  }

  public async CustomerExist({ email }) {
    try {
      const list = await this._Stripe.customers.list({ email });
      const exist = !!list.data.length;

      return exist;
    } catch (error) {
      throw error;
    }
  }

  public async CreateStripePortal(customer: string) {
    try {
      const session = await this._Stripe.billingPortal.sessions.create({
        customer: customer,
        return_url: "https://google.com/"
      })

      return session.url;
    } catch (error) {
      throw error;
    }
  }

  public async CustomerCreated(customer) {
    try {
      const options: Stripe.SubscriptionCreateParams = {
        customer: customer.id,
        collection_method: 'charge_automatically',
        items: [{ price: StripeConstants.FreePlan, quantity: 1 }],
        payment_behavior: 'allow_incomplete',
        proration_behavior: 'always_invoice',
      }

      const subscription: Stripe.Subscription = await this._Stripe.subscriptions.create(options)
      
      return subscription;
    } catch (error) {
      throw error;
    }
  }
}
