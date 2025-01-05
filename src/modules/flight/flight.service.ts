import { Injectable } from '@nestjs/common';
import {
  GetFlightListDto,
  GetFlightListResponseDto,
} from './dtos/get-flight-list.dto';
import { RapidApiService } from '../clients/rapid-api/rapid-api.service';
import {
  GetGroupedPriceResponseDto,
  GetPriceListDto,
  GetPriceListResponseDto,
} from './dtos';

@Injectable()
export class FlightService {
  constructor(private readonly rapidApiService: RapidApiService) {}

  async getFlightList(
    getFlightListDto: GetFlightListDto,
  ): Promise<GetFlightListResponseDto> {
    try {
      return await this.rapidApiService.getRapidApiFlightList(getFlightListDto);
    } catch (error) {
      throw error;
    }
  }
  async getPriceList(
    getPriceListDto: GetPriceListDto,
  ): Promise<GetGroupedPriceResponseDto | GetPriceListResponseDto> {
    try {
      return await this.rapidApiService.getRapidApiPriceList(getPriceListDto);
    } catch (error) {
      throw error;
    }
  }
}
