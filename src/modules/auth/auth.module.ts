import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthGuard } from '@src/guards';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CqrsModule],
  providers: [AuthGuard, AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
