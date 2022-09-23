import Stripe from "stripe";

export namespace IStripeWebhook {
  export interface Event<T = {}> extends Stripe.Event {
    data: Stripe.Event.Data & {
      object: Stripe.Event.Data.Object & T;
    };
  }

  export namespace Limits {
    export type Params = {
      isPremium: boolean;
      customerId: string;
      customerEmail: string;
    }
  }
}
