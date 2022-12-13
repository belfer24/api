export class UTCDate {
  static GetDateByUTC() {
    const date = new Date();
    const dateByUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
    
    return dateByUTC;
  }
}
