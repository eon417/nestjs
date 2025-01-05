import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@src/config/configuration';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/filters';
import { AuthGuard } from '@src/guards';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { LoggerInterceptor } from '@src/interceptors/logger.interceptor';
import { HttpModule } from '@nestjs/axios';
import { FlightModule } from '../flight/flight.module';
import { RapidApiModule } from '../clients/rapid-api/rapid-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRY, 10) },
    }),
    HttpModule.register({
      global: true,
      timeout: 5000,
    }),
    RapidApiModule,
    AuthModule,
    UserModule,
    FlightModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
