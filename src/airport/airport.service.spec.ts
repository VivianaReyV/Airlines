import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.lorem.word(3),
        country: faker.lorem.word(),
        city: faker.lorem.word(),
      });
      airportsList.push(airport);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedairport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedairport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedairport.name);
    expect(airport.code).toEqual(storedairport.code);
    expect(airport.country).toEqual(storedairport.country);
    expect(airport.city).toEqual(storedairport.city);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: faker.lorem.word(3),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
      airlines: [],
    };

    const newairport: AirportEntity = await service.create(airport);
    expect(newairport).not.toBeNull();

    const storedairport: AirportEntity = await repository.findOne({
      where: { id: newairport.id },
    });
    expect(storedairport).not.toBeNull();
    expect(airport.name).toEqual(storedairport.name);
    expect(airport.code).toEqual(storedairport.code);
    expect(airport.country).toEqual(storedairport.country);
    expect(airport.city).toEqual(storedairport.city);
  });

  it('update should modify an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = 'New name';
    airport.code = 'ABC';

    const updatedairport: AirportEntity = await service.update(
      airport.id,
      airport,
    );
    expect(updatedairport).not.toBeNull();

    const storedairport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(storedairport).not.toBeNull();
    expect(storedairport.name).toEqual(airport.name);
    expect(storedairport.code).toEqual(airport.code);
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport,
      name: 'New name',
      code: 'ABC',
    };
    await expect(() => service.update('0', airport)).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('delete should remove a airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);

    const deletedairport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(deletedairport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });
});
