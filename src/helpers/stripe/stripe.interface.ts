import Stripe from 'stripe';

export namespace IStripeHelper {
  export namespace Guard {
    export type Params = {
      body: string | Buffer;
      signature: any;
    }
  }
  export namespace Customer {
    export namespace Get {
      export type Request = {
        customerId: string;
      };

      export type Response = Promise<Stripe.Customer | null>;
    }

    export namespace Exist {
      export type Request = {
        email: string;
      };

      export type Response = Promise<boolean>;
    }

    export namespace Create {
      export interface Request
        extends Omit<
          Stripe.CustomerCreateParams,
          'email' | 'payment_method' | 'address'
        > {
        email: string;
        payment_method?: string;
        address?: Stripe.AddressParam;
      }

      export type Response = Promise<Stripe.Customer>;
    }

    export namespace Update {
      export type Request = {
        customerId: string;
        params: Stripe.CustomerUpdateParams;
      };

      export type Response = Promise<Stripe.Customer>;
    }

    export namespace Delete {
      export type Request = {
        customerId: string;
      };

      export type Response = Promise<API.Status>;
    }
  }

  export namespace Subscription {
    export namespace GetOneById {
      export interface Request {
        subscriptionId: string;
      }

      export type Response = Promise<Stripe.Subscription>;
    }

    export namespace Create {
      export type Request = {
        customerId: string;
        priceId: string;
        quantity: number;
        promotionCodeId?: string;
        paymentBehavior?: Stripe.SubscriptionCreateParams.PaymentBehavior;
        prorationBehavior?: Stripe.SubscriptionCreateParams.ProrationBehavior;
      };

      export type Response = Promise<Stripe.Subscription>;
    }

    export namespace Update {
      export type Request = {
        subscriptionId: string;
        quantity: number;
        priceId: string;
        paymentBehavior?: Stripe.SubscriptionCreateParams.PaymentBehavior;
        prorationBehavior?: Stripe.SubscriptionCreateParams.ProrationBehavior;
      };

      export type Response = Promise<Stripe.SubscriptionItem>;
    }

    export namespace Delete {
      export type Request = {
        subscriptionId: string;
      };

      export type Response = Promise<Stripe.Subscription>;
    }
  }

  export namespace PromotionCode {
    export namespace GetId {
      export type Request = {
        code: string;
      };

      export type Response = Promise<string>;
    }

    export namespace Set {
      export type Request = {
        subscriptionId: string;
        promotionCodeId: string;
      };

      export type Response = Promise<Stripe.Subscription>;
    }

    export interface Update {
      subscriptionId: string;
      promotionCodeId: string;
    }
  }

  export namespace PaymentMethod {
    export namespace Set {
      export type Request = {
        customerId: string;
        paymentMethodId: string;
      };

      export type Response = Promise<Stripe.Customer>;
    }

    export namespace Update {
      export type Request = {
        customerId: string;
        paymentMethodId: string;
        oldPaymentMethodId: string;
      };

      export type Response = Promise<Stripe.Customer>;
    }

    export namespace GetId {
      export type Request = {
        customerId: string;
      };

      export type Response = Promise<string | null>;
    }

    export namespace GetCardById {
      export type Request = {
        paymentMethodId: string;
      };

      export type Response = Promise<Stripe.PaymentMethod.Card | undefined>;
    }
  }

  export namespace Event {
    export type Data = {
      data: {
        object: {
          id: string,
          customer: string
        },
      }
    }
  }
}
