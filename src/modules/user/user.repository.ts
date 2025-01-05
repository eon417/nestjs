import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(
    email: string,
    deletePassword: boolean = true,
  ): Promise<UserEntity> {
    try {
      const user = await this.prisma.users.findUnique({ where: { email } });

      return user
        ? UserMapper.mapFromRepoToEntity(user, deletePassword)
        : undefined;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.users.findUnique({ where: { id } });

      return user ? UserMapper.mapFromRepoToEntity(user) : undefined;
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.prisma.users.create({ data });
      return UserMapper.mapFromRepoToEntity(user);
    } catch (error) {
      throw error;
    }
  }

  async updateById(id: string, data: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.prisma.users.update({ where: { id }, data });
      return UserMapper.mapFromRepoToEntity(user);
    } catch (error) {
      throw error;
    }
  }
}
