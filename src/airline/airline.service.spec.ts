import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webPage: faker.internet.url(),
      });
      airlinesList.push(airline);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedairline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedairline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedairline.name);
    expect(airline.description).toEqual(storedairline.description);
    expect(airline.foundationDate).toEqual(storedairline.foundationDate);
    expect(airline.webPage).toEqual(storedairline.webPage);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: [],
    };

    const newairline: AirlineEntity = await service.create(airline);
    expect(newairline).not.toBeNull();

    const storedairline: AirlineEntity = await repository.findOne({
      where: { id: newairline.id },
    });
    expect(storedairline).not.toBeNull();
    expect(storedairline.name).toEqual(newairline.name);
    expect(storedairline.description).toEqual(newairline.description);
    expect(storedairline.foundationDate).toEqual(newairline.foundationDate);
    expect(storedairline.webPage).toEqual(newairline.webPage);
  });

  it('update should modify an airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = 'New name';
    airline.description = 'New description';

    const updatedairline: AirlineEntity = await service.update(
      airline.id,
      airline,
    );
    expect(updatedairline).not.toBeNull();

    const storedairline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(storedairline).not.toBeNull();
    expect(storedairline.name).toEqual(airline.name);
    expect(storedairline.description).toEqual(airline.description);
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('0', airline)).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);

    const deletedairline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(deletedairline).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
});
