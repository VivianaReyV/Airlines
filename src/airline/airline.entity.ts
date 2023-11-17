import { AirportEntity } from 'src/airport/airport.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/* eslint-disable prettier/prettier */
@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  foundationDate: Date;

  @Column()
  webPage: string;

  @ManyToMany(() => AirportEntity, (airport) => airport.airlines)
  @JoinTable()
  airports: AirportEntity[];
}
