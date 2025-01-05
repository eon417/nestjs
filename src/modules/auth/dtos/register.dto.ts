import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Match } from '@src/decorators';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class RegisterDto extends IntersectionType(
  PickType(UserEntity, ['email']),
  PickType(PartialType(UserEntity), ['first_name', 'last_name']),
) {
  @ApiProperty({})
  @IsNotEmpty()
  password: string;

  @ApiProperty({})
  @IsNotEmpty()
  @Match('password', { message: 'Confirm password must match password' })
  confirm_password: string;
}
