import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import {
  UserEmailDuplicateError,
  UserEmailNotFoundError,
  UserIdNotFoundError,
} from '@src/errors';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { hashPassword as UHashPassword } from '@src/utils';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(password: string): Promise<string> {
    try {
      return await UHashPassword(password);
    } catch (error) {
      throw error;
    }
  }

  private async sanitizeEmail(email: string): Promise<string> {
    try {
      return email ? email.toLowerCase() : undefined;
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(
    email: string,
    config: {
      throwError?: boolean;
      deletePassword?: boolean;
    } = { throwError: true, deletePassword: true },
  ): Promise<UserEntity> {
    try {
      const sanitizedEmail = await this.sanitizeEmail(email);
      const res = await this.userRepository.getByEmail(
        sanitizedEmail,
        config.deletePassword,
      );

      if (!res && config.throwError) {
        throw new UserEmailNotFoundError(email);
      }

      return res;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<UserEntity> {
    try {
      const res = await this.userRepository.getById(id);

      if (!res) {
        throw new UserIdNotFoundError(id);
      }

      return res;
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    try {
      const { password, email, ...rest } = data;

      const hashedPassword = await this.hashPassword(password);
      const sanitizedEmail = await this.sanitizeEmail(email);

      const user = await this.getByEmail(email, { throwError: false });
      if (user) {
        throw new UserEmailDuplicateError(email);
      }

      return await this.userRepository.create({
        ...rest,
        email: sanitizedEmail,
        password: hashedPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  private userEmailUpdated(user: UserEntity, email: string): boolean {
    return email && user && user.email !== email;
  }

  async updateById(id: string, data: UpdateUserDto): Promise<UserEntity> {
    try {
      const { password, email, ...rest } = data;

      const user = await this.getById(id);
      const isUserEmailUpdated = this.userEmailUpdated(user, email);
      if (isUserEmailUpdated) {
        throw new UserEmailDuplicateError(email);
      }
      const hashedPassword = await this.hashPassword(password);
      const sanitizedEmail = await this.sanitizeEmail(email);

      return await this.userRepository.updateById(id, {
        ...rest,
        ...(isUserEmailUpdated && { email: sanitizedEmail }),
        ...(password && { password: hashedPassword }),
      });
    } catch (error) {
      throw error;
    }
  }
}
