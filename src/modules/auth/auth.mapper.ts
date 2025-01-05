import { UserEntity } from '../user/entities/user.entity';

export class AuthMapper {
  public static mapToAccessTokenPayload(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      status: user.status,
    };
  }
}
