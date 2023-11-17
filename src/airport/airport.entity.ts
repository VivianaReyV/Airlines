import { AirlineEntity } from '../airline/airline.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

/* eslint-disable prettier/prettier */
@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @ManyToMany(() => AirlineEntity, (airline) => airline.airports)
  airlines: AirlineEntity[];
}
