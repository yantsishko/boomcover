'use strict';

import {
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class WeatherCity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    city_id: string;

    @Column('varchar')
    city_name: string;

    @Column('varchar')
    @Index()
    country: string;

    @Column('float')
    coord_lon: number;

    @Column('float')
    coord_lat: number;
}
