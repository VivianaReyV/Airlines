import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find();
  }

  async findOne(id: string): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airport;
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    if (airport.code.length === 3) {
      return await this.airportRepository.save(airport);
    } else {
      throw new BusinessLogicException(
        'The airport code must contain three characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const persistedAirport: AirportEntity =
      await this.airportRepository.findOne({
        where: { id },
      });
    if (!persistedAirport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (airport.code.length === 3) {
      return await this.airportRepository.save({
        ...persistedAirport,
        ...airport,
      });
    } else {
      throw new BusinessLogicException(
        'The airport code must contain three characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  }

  async delete(id: string) {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airportRepository.remove(airport);
  }
}
