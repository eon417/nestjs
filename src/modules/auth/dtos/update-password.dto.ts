import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@src/decorators';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({})
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({})
  @IsNotEmpty()
  new_password: string;

  @ApiProperty({})
  @IsNotEmpty()
  @Match('new_password', { message: 'Confirm password must match password' })
  confirm_new_password: string;
}
