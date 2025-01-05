import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RapidApiService } from './rapid-api.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [RapidApiService],
  exports: [RapidApiService],
})
export class RapidApiModule {}
