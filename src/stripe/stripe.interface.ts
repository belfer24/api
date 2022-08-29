export namespace IStripeWebhook {
  export namespace Service {
    export namespace CustomerCreate {
      export type Params = any;

      export type ReturnData = Promise<API.Status>;
    }

    export namespace SubscriptionUpdated {
      export type Params = any;

      export type ReturnData = Promise<API.Status>;
    }

    export namespace InvoicePaymentSuccess {
      export type Params = any;

      export type ReturnData = Promise<API.Status>;
    }
    export namespace InvoicePaymentFailed {
      export type Params = any;

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
