import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();

    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        name: faker.company.name(),
        code: faker.lorem.word(),
        country: faker.lorem.word(),
        city: faker.lorem.word(),
      });
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.anytime(),
      webPage: faker.internet.url(),
      airports: airportsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to a airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
    });

    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.anytime(),
      webPage: faker.internet.url(),
    });

    const result: AirlineEntity = await service.addAirportToAirline(
      newAirline.id,
      newAirport.id,
    );

    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name);
    expect(result.airports[0].code).toBe(newAirport.code);
    expect(result.airports[0].country).toBe(newAirport.country);
    expect(result.airports[0].city).toBe(newAirport.city);
  });

  it('addAirportToAirline should thrown exception for an invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.anytime(),
      webPage: faker.internet.url(),
    });

    await expect(() =>
      service.addAirportToAirline(newAirline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('addAirportToAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
    });

    await expect(() =>
      service.addAirportToAirline('0', newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('findAirportFromAirline should return airport by airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedairport: AirportEntity = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(storedairport).not.toBeNull();
    expect(storedairport.name).toBe(airport.name);
    expect(storedairport.code).toBe(airport.code);
    expect(storedairport.country).toBe(airport.country);
    expect(storedairport.city).toBe(airport.city);
  });

  it('findAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.findAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('findAirportFromAirline should throw an exception for an airport not associated to the airline', async () => {
    const newairport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
    });

    await expect(() =>
      service.findAirportFromAirline(airline.id, newairport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });

  it('findAirportsFromAirline should return airports by airline', async () => {
    const airports: AirportEntity[] = await service.findAirportsFromAirline(
      airline.id,
    );
    expect(airports.length).toBe(5);
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('updateAirportsFromAirline should update airports list for a airline', async () => {
    const newairport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
    });

    const updatedairline: AirlineEntity =
      await service.updateAirportsFromAirline(airline.id, [newairport]);
    expect(updatedairline.airports.length).toBe(1);

    expect(updatedairline.airports[0].name).toBe(newairport.name);
    expect(updatedairline.airports[0].code).toBe(newairport.code);
    expect(updatedairline.airports[0].country).toBe(newairport.country);
    expect(updatedairline.airports[0].city).toBe(newairport.city);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airline', async () => {
    const newairport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
    });

    await expect(() =>
      service.updateAirportsFromAirline('0', [newairport]),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airport', async () => {
    const newairport: AirportEntity = airportsList[0];
    newairport.id = '0';

    await expect(() =>
      service.updateAirportsFromAirline(airline.id, [newairport]),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('deleteAirportFromAirline should remove an airport from a airline', async () => {
    const airport: AirportEntity = airportsList[0];

    await service.deleteAirportFromAirline(airline.id, airport.id);

    const storedairline: AirlineEntity = await airlineRepository.findOne({
      where: { id: airline.id },
      relations: ['airports'],
    });
    const deletedairport: AirportEntity = storedairline.airports.find(
      (a) => a.id === airport.id,
    );

    expect(deletedairport).toBeUndefined();
  });

  it('deleteAirportFromAirline should thrown an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('deleteAirportFromAirline should thrown an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.deleteAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('deleteAirportFromAirline should thrown an exception for an non asocciated airport', async () => {
    const newairport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
    });

    await expect(() =>
      service.deleteAirportFromAirline(airline.id, newairport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });
});
