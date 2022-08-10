export class RequestUtils {
  static ObjectToQuery(params: { [key: string]: string }) {
    const data = Object.entries(params).map(([data, value]) => `${data}=${value}`);

    return data.join('&');
  }
}
