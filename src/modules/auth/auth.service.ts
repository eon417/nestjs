import { Injectable } from '@nestjs/common';
import { LoginDto, LoginResponseDto, UpdatePasswordDto } from './dtos';
import { UserEntity } from '../user/entities/user.entity';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  GetUserByEmailCommand,
  UpdateUserPasswordCommand,
} from '@src/commands';
import { comparePassword } from '@src/utils';
import { AuthenticationError, PasswordAuthenticationError } from '@src/errors';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { AuthMapper } from './auth.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  private async executeGetUserByEmailCommand(
    email: string,
  ): Promise<UserEntity> {
    try {
      return await this.commandBus.execute(new GetUserByEmailCommand(email));
    } catch (error) {
      throw error;
    }
  }

  private async checkUserPasswordCorrect(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await comparePassword(rawPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  private async generateAccessToken(
    user: UserEntity,
    expiresIn: number = 30 * 24 * 60 * 60,
  ): Promise<LoginResponseDto> {
    try {
      const now = new Date();
      const expiredAt = new Date(now.getTime() + expiresIn * 1000);
      const accessToken = await this.jwtService.signAsync(
        AuthMapper.mapToAccessTokenPayload(user),
        { expiresIn },
      );

      return {
        access_token: accessToken,
        expired_at: expiredAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginDto): Promise<LoginResponseDto> {
    try {
      const { email, password } = data;

      const user = await this.executeGetUserByEmailCommand(email);

      if (!user) {
        throw new Error();
      }

      const isUserPasswordCorrect = await this.checkUserPasswordCorrect(
        password,
        user.password,
      );

      if (!isUserPasswordCorrect) {
        throw new Error();
      }

      return await this.generateAccessToken(user);
    } catch (error) {
      throw new AuthenticationError();
    }
  }

  async register(data: RegisterDto): Promise<UserEntity> {
    try {
      const { email, password, first_name, last_name } = data;

      return await this.commandBus.execute(
        new CreateUserCommand(email, password, first_name, last_name),
      );
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    reqUser: UserEntity,
    data: UpdatePasswordDto,
  ): Promise<void> {
    try {
      const { old_password } = data;

      const user = await this.executeGetUserByEmailCommand(reqUser.email);
      const isUserPasswordCorrect = await this.checkUserPasswordCorrect(
        old_password,
        user.password,
      );

      if (!isUserPasswordCorrect) {
        throw new PasswordAuthenticationError();
      }

      await this.commandBus.execute(
        new UpdateUserPasswordCommand(user.id, data.new_password),
      );
      return;
    } catch (error) {
      throw error;
    }
  }
}
