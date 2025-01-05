import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserEntity {
  @ApiProperty({})
  @IsNotEmpty()
  id: string;

  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string;

  @ApiProperty({})
  @IsNotEmpty()
  password: string;

  @ApiProperty({ default: UserStatus.UNVERIFIED })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({ default: new Date() })
  @IsDate()
  created_at: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  updated_at?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  deleted_at?: Date;

  constructor(data: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    password: string;
    status: UserStatus;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.password = data.password;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }

  public isUnverified(): boolean {
    return this.status === UserStatus.UNVERIFIED;
  }
}
