import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserPasswordCommand } from '@src/commands';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(private userService: UserService) {}

  async execute(command: UpdateUserPasswordCommand): Promise<UserEntity> {
    const { id, password } = command;
    return await this.userService.updateById(id, { password });
  }
}
