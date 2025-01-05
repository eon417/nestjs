import { ApiProperty } from '@nestjs/swagger';
import { ListResponseDto } from '@src/common/dtos/list.dto';
import { DateFormatter, IsDateRangeValid, ToBoolean } from '@src/decorators';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetPriceListDto {
  @ApiProperty({ default: 'MY' })
  @IsNotEmpty()
  fromEntityId: string;

  @ApiProperty({ default: 'PARI' })
  @IsNotEmpty()
  toEntityId: string;

  @ApiProperty({ default: new Date().toISOString().split('T')[0] })
  @DateFormatter()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ default: new Date().toISOString().split('T')[0] })
  @DateFormatter()
  @IsNotEmpty()
  @IsDateRangeValid('startDate', { message: 'endDate must be after startDate' })
  endDate: string;

  @ApiProperty({ required: false })
  @ToBoolean()
  @IsOptional()
  group: boolean;
}

export class GetPriceResponseDto {
  day: string; /* data.flights.days.day */
  group: string; /* data.flights.days.group */
  price: number; /* data.flights.days.price */
}

export class GetGroupedPriceResponseDto {
  weekdays: GetPriceResponseDto[];
  weekends: GetPriceResponseDto[];
}

export class GetPriceListResponseDto extends ListResponseDto<GetPriceResponseDto> {}
