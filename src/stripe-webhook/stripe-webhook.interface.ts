import Stripe from "stripe";

export namespace IStripeWebhook {
  export interface Event<T = {}> extends Stripe.Event {
    data: Stripe.Event.Data & {
      object: Stripe.Event.Data.Object & T;
    };
  }
}
