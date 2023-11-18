import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from 'src/airline/airline.entity';
import { AirportEntity } from 'src/airport/airport.entity';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
  providers: [AirlineAirportService],
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
