import { ApiProperty } from '@nestjs/swagger';
import { DateFormatter } from '@src/decorators';
import { IsNotEmpty } from 'class-validator';
import { ListResponseDto } from '@src/common/dtos/list.dto';

export class GetFlightListDto {
  @ApiProperty({ default: 'PARI' })
  @IsNotEmpty()
  from: string;

  @ApiProperty({ default: 'MSYA' })
  @IsNotEmpty()
  to: string;

  // @ApiProperty({ type: Date })
  // @DateFormatter()
  // @IsNotEmpty()
  // start_date?: string;

  // @ApiProperty({ type: Date })
  // @DateFormatter()
  // @IsNotEmpty()
  // end_date?: string;

  @ApiProperty({ type: Date })
  @DateFormatter()
  @IsNotEmpty()
  depart_date: string;

  @ApiProperty({ type: Date })
  @DateFormatter()
  @IsNotEmpty()
  return_date: string;

  // @ApiProperty({ required: false, default: false })
  // @ToBoolean()
  // @IsOptional()
  // group?: boolean;
}

export class AirportDto {
  id: string;
  entityId: string;
  country: string;
  city: string;
  name: string;
}

export class RoundtripFlightDto {
  departure_date: Date;
  arrival_date: Date;
  origin_airports: AirportDto[];
  destination_airports: AirportDto[];
}

export class GetFlightResponseDto {
  raw_price: number;
  price: string;
  origin_flight: RoundtripFlightDto;
  destination_flight: RoundtripFlightDto;
}

export class GetFlightListResponseDto extends ListResponseDto<GetFlightResponseDto> {}
