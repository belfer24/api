export class UserDto {
  readonly email: string;
  readonly refresh_token: string;
}

export class ResetLimitsDto {
  readonly authorization: string;
}
