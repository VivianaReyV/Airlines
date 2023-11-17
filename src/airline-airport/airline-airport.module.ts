import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from 'src/airline/airline.entity';
import { AirportEntity } from 'src/airport/airport.entity';

@Module({
  providers: [AirlineAirportService],
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
})
export class AirlineAirportModule {}
