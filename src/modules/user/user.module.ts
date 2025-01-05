import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './handlers';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...CommandHandlers],
  exports: [],
})
export class UserModule {}
