import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class LoginDto extends PickType(UserEntity, ['email', 'password']) {}

export class LoginResponseDto {
  @ApiProperty({})
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({})
  @IsNotEmpty()
  expired_at: Date;
}
