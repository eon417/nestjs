import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetUserByIdCommand } from '@src/commands';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';

@CommandHandler(GetUserByIdCommand)
export class GetUserByIdHandler implements ICommandHandler<GetUserByIdCommand> {
  constructor(private userService: UserService) {}

  async execute(command: GetUserByIdCommand): Promise<UserEntity> {
    const { id } = command;
    return await this.userService.getById(id);
  }
}
