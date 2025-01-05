import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RapidApiMapper } from './rapid-api.mapper';
import { firstValueFrom } from 'rxjs';
import {
  GetPriceListDto,
  GetFlightListDto,
  GetFlightListResponseDto,
  GetGroupedPriceResponseDto,
  GetPriceListResponseDto,
  GetFlightResponseDto,
} from '@src/modules/flight/dtos';
import { ExternalAPiError } from '@src/errors/external.error';
import { HeapSort } from '@src/utils';
import { addDays, format } from 'date-fns';

@Injectable()
export class RapidApiService {
  private readonly BASE_URL: string = process.env.RAPID_API_BASE_URL;
  private readonly API_KEY: string = process.env.RAPID_API_KEY;
  private readonly ENDPOINTS = {
    SEARCH_ROUND_TRIP: '/flights/search-roundtrip',
    SEARCH_INCOMPLETE: '/flights/search-incomplete',
    SEARCH_PRICE: '/flights/price-calendar',
  };
  private readonly headers = { 'x-rapidapi-key': this.API_KEY };

  constructor(private readonly httpService: HttpService) {}

  private getDepartDates(start_date: string, end_date: string): string[] {
    const dates: string[] = [];
    for (
      let date = new Date(start_date);
      date <= new Date(end_date);
      date = addDays(date, 1)
    ) {
      dates.push(format(date.toISOString(), 'yyyy-MM-dd'));
    }
    return dates;
  }

  private async rapidApiGetRoundtripList(
    getFlightListDto: GetFlightListDto,
  ): Promise<GetFlightListResponseDto> {
    try {
      const { depart_date, /* start_date, end_date, */ ...rest } =
        getFlightListDto;

      // const departDates = this.getDepartDates(start_date, end_date);

      let responses: any[] = [];

      // for (const date of departDates) {
      const queries = RapidApiMapper.mapToGetRoundtripQuery({
        ...rest,
        depart_date,
        // depart_date: date,
      });
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}${this.ENDPOINTS.SEARCH_ROUND_TRIP}?${queries}`,
          { headers: this.headers },
        ),
      );
      if (!response.data.status) {
        throw new ExternalAPiError();
      }
      let data = response.data.data;

      while (data.context.status !== 'complete') {
        data = await this.searchInComplete(data.context.sessionId);
      }
      // const data = mockData.data;
      responses.push(data);
      // }

      return this.handleGetFlightResponse(responses);
    } catch (error) {
      if (error.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new ExternalAPiError(error.response.data.message);
      }
      throw error;
    }
  }

  private async searchInComplete(sessionId: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}${this.ENDPOINTS.SEARCH_INCOMPLETE}?sessionId=${sessionId}`,
          { headers: this.headers },
        ),
      );
      if (!res.data.status) {
        throw new ExternalAPiError();
      }
      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  private async getPriceList(getPriceListDto: GetPriceListDto) {
    try {
      const { group, startDate, endDate, ...rest } = getPriceListDto;
      const queries = Object.keys(rest)
        .map((key) => {
          if (getPriceListDto[key]) {
            return `${encodeURIComponent(key)}=${encodeURIComponent(getPriceListDto[key])}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('&');

      const res = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}${this.ENDPOINTS.SEARCH_PRICE}?${queries}&departDate=${startDate}`,
          { headers: this.headers },
        ),
      );

      if (!res.data.status) {
        throw new ExternalAPiError();
      }
      let data = res.data.data;

      const result = RapidApiMapper.mapToGetPriceListResponseDto(
        data.flights.days,
        group,
        new Date(startDate),
        new Date(endDate),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getRapidApiPriceList(
    getPriceListDto: GetPriceListDto,
  ): Promise<GetGroupedPriceResponseDto | GetPriceListResponseDto> {
    try {
      return this.getPriceList(getPriceListDto);
    } catch (error) {
      throw error;
    }
  }
  async getRapidApiFlightList(
    getFlightListDto: GetFlightListDto,
  ): Promise<GetFlightListResponseDto> {
    try {
      return this.rapidApiGetRoundtripList(getFlightListDto);
    } catch (error) {
      throw error;
    }
  }

  private handleGetFlightResponse(raw_data: any[]): GetFlightListResponseDto {
    try {
      const res: GetFlightResponseDto[] = [];
      for (const data of raw_data) {
        const itineraries = data.itineraries;
        const airports = data.filterStats.airports;

        itineraries.map((itinerary) =>
          res.push(
            RapidApiMapper.mapToGetFlightResponseDto(itinerary, airports),
          ),
        );
      }

      const sortedItems = HeapSort.sort(res);

      return {
        size: res.length,
        items: sortedItems,
      };
    } catch (error) {
      throw error;
    }
  }
}
