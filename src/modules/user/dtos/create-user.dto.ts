import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto extends IntersectionType(
  PickType(UserEntity, ['email', 'password']),
  PickType(PartialType(UserEntity), ['first_name', 'last_name']),
) {}
