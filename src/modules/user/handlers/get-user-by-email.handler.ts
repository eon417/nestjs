import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetUserByEmailCommand } from '@src/commands';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';

@CommandHandler(GetUserByEmailCommand)
export class GetUserByEmailHandler
  implements ICommandHandler<GetUserByEmailCommand>
{
  constructor(private userService: UserService) {}

  async execute(command: GetUserByEmailCommand): Promise<UserEntity> {
    const { email } = command;
    return await this.userService.getByEmail(email, {
      throwError: false,
      deletePassword: false,
    });
  }
}
