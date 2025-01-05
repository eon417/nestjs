import { CreateUserHandler } from './create-user.handler';
import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { UpdateUserPasswordHandler } from './update-user-password.handler';

export const CommandHandlers = [
  GetUserByIdHandler,
  GetUserByEmailHandler,
  UpdateUserPasswordHandler,
  CreateUserHandler,
];
