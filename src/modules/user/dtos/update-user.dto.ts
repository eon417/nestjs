import { PartialType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto extends PickType(PartialType(UserEntity), [
  'email',
  'password',
  'first_name',
  'last_name',
  'status',
]) {}
