import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '@src/commands';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private userService: UserService) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    return await this.userService.create(command);
  }
}
