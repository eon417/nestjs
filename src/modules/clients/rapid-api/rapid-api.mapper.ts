import {
  GetGroupedPriceResponseDto,
  GetPriceListResponseDto,
  GetPriceResponseDto,
} from '@src/modules/flight/dtos';
import {
  AirportDto,
  RoundtripFlightDto,
  GetFlightResponseDto,
  GetFlightListDto,
} from '@src/modules/flight/dtos/get-flight-list.dto';

export class RapidApiMapper {
  public static mapToGetRoundtripQuery(
    getFlightListDto: GetFlightListDto,
  ): string {
    const data = {
      fromEntityId: getFlightListDto.from,
      toEntityId: getFlightListDto.to,
      departDate: getFlightListDto.depart_date,
      returnDate: getFlightListDto.return_date,
    };

    const defaultQueryArray = [
      'includeDestinationNearbyAirports=true',
      'includeDestinationNearbyAirports=true',
    ];

    const queryArray = Object.keys(data)
      .map((key) => {
        if (data[key]) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
        }
        return null;
      })
      .filter(Boolean);

    const query: string = [...queryArray, ...defaultQueryArray].join('&');

    return query;
  }

  private static findAirportByEntityId(
    entityId: string,
    data: any,
  ): AirportDto[] {
    for (const airport of data) {
      const matchingAirport = airport.airports.find(
        (ap: AirportDto) => ap.entityId === entityId,
      );
      if (matchingAirport) {
        return [matchingAirport];
      }
    }
    return null;
  }

  public static mapToRoundtripFlightDto(
    leg: any,
    airports: any,
  ): RoundtripFlightDto {
    const originAirportData = RapidApiMapper.findAirportByEntityId(
      leg.origin.entityId,
      airports,
    );
    const destinationAirportData = RapidApiMapper.findAirportByEntityId(
      leg.destination.entityId,
      airports,
    );

    const res: RoundtripFlightDto = {
      departure_date: leg.departure,
      arrival_date: leg.arrival,
      origin_airports: originAirportData,
      destination_airports: destinationAirportData,
    };

    return res;
  }

  public static mapToGetFlightResponseDto(
    itinerary: any,
    airports: any,
  ): GetFlightResponseDto {
    const res: GetFlightResponseDto = {
      raw_price: itinerary.price.raw,
      price: itinerary.price.formatted,
      origin_flight: RapidApiMapper.mapToRoundtripFlightDto(
        itinerary.legs[0],
        airports,
      ),
      destination_flight: RapidApiMapper.mapToRoundtripFlightDto(
        itinerary.legs[0],
        airports,
      ),
    };

    return res;
  }

  private static isWeekday(dateString) {
    const date = new Date(dateString);
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  }

  private static groupData(
    data: GetPriceResponseDto[],
  ): GetGroupedPriceResponseDto {
    const res = data.reduce(
      (acc, item) => {
        const key = this.isWeekday(item.day) ? 'weekdays' : 'weekends';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      },
      { weekdays: [], weekends: [] },
    );
    return res;
  }

  public static mapToGetPriceListResponseDto(
    data: GetPriceResponseDto[],
    isGrouping: boolean = false,
    startDate?: Date,
    endDate?: Date,
  ): GetPriceListResponseDto | GetGroupedPriceResponseDto {
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.day);
      return (
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate)
      );
    });
    const sortedData = filteredData.sort((a, b) => a.price - b.price);
    if (!isGrouping) {
      return {
        size: filteredData.length,
        items: sortedData,
      };
    }

    return this.groupData(sortedData);
  }
}
