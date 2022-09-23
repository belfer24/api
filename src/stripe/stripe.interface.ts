import Stripe from 'stripe';

export namespace IStripe {
  export interface Event<T = {}> extends Stripe.Event {
    data: Stripe.Event.Data & {
      object: Stripe.Event.Data.Object & T;
    };
  }
  export namespace Service {
    export type Customer = {
      id: string;
      object: string;
      balance: number;
      email: string;
    };
    export namespace CustomerCreate {
      export type Params = {
        customer: {
          data: {
            object: {
              id: string;
              object: string;
              balance: number;
              created: number;
            };
          };
        };
      };

      export type ReturnData = Promise<API.Status>;
    }

    export namespace SubscriptionUpdated {
      export type Params = Record<string, unknown>;

      export type ReturnData = Promise<API.Status>;
    }

    export namespace InvoicePaymentSuccess {
      export type Params = Record<string, unknown>;

      export type ReturnData = Promise<API.Status>;
    }
    export namespace InvoicePaymentFailed {
      export type Params = Record<string, unknown>;

      export type ReturnData = Promise<API.Status>;
    }
  }

  export namespace Controller {
    export namespace CustomerCreated {
      export type Body = Service.CustomerCreate.Params;
      export type Response = API.Controller<API.Status>;
    }

    export namespace SubscriptionUpdated {
      export type Body = Service.SubscriptionUpdated.Params;
      export type Response = API.Controller<API.Status>;
    }

    export namespace InvoicePaymentSuccess {
      export type Body = Service.CustomerCreate.Params;
      export type Response = API.Controller<API.Status>;
    }

    export namespace InvoicePaymentFailed {
      export type Body = Service.CustomerCreate.Params;
      export type Response = API.Controller<API.Status>;
    }
  }
}
