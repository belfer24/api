declare namespace API {
  export type Controller<T> = Promise<{
    data: T | null;
    error?: Error;
  }>;

  export type Status = {
    success: boolean;
  };
}
