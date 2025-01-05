import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RapidApiModule } from '../clients/rapid-api/rapid-api.module';

@Module({
  imports: [PrismaModule, RapidApiModule],
  controllers: [FlightController],
  providers: [FlightService],
  exports: [],
})
export class FlightModule {}
