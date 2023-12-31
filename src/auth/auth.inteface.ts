export namespace IAuth {
  export namespace Service {
    export namespace OutlookRedirectHandler {
      export type Params = {
        state: string;
        code: string;
      };
    }

    export namespace GetOutlookRedirectUrl {
      export type Params = {
        chromeExtensionId: string,
      }
    }
  }

  export namespace Controller {
    export namespace OutlookRedirectHandler {
      export type Query = Service.OutlookRedirectHandler.Params;
    }
  }
}
