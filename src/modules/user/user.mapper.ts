import { Users } from '@prisma/client';
import { UserEntity } from './entities/user.entity';

export class UserMapper {
  public static mapFromRepoToEntity(
    data: Users,
    deletePassword: boolean = true,
  ): UserEntity {
    const user = new UserEntity({
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      deleted_at: data.deleted_at,
    });

    if (deletePassword) {
      delete user.password;
    }

    return user;
  }
}
