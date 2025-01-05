export class GetUserByIdCommand {
  constructor(public readonly id: string) {}
}

export class GetUserByEmailCommand {
  constructor(public readonly email: string) {}
}
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly first_name?: string,
    public readonly last_name?: string,
  ) {}
}

export class UpdateUserPasswordCommand {
  constructor(
    public readonly id: string,
    public readonly password: string,
  ) {}
}
