import { Controller, Get, Query } from '@nestjs/common';
import { FlightService } from './flight.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GetFlightListDto,
  GetFlightListResponseDto,
} from './dtos/get-flight-list.dto';
import { GetPriceListDto } from './dtos';

@Controller('flight')
@ApiTags('flight')
@ApiBearerAuth()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('/list')
  @ApiOkResponse({ type: GetFlightListResponseDto })
  async getFlightList(@Query() getFlightListDto: GetFlightListDto) {
    try {
      return await this.flightService.getFlightList(getFlightListDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/price-list')
  @ApiOkResponse({ type: GetFlightListResponseDto })
  async getPriceList(@Query() getPriceListDto: GetPriceListDto) {
    try {
      return await this.flightService.getPriceList(getPriceListDto);
    } catch (error) {
      throw error;
    }
  }
}
