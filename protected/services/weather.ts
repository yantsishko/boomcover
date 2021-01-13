'use strict';

import cache from '@component/cache';
import log from '@component/logger';
import { WeatherCity } from '@entity/WeatherCity';
import sha256 = require('crypto-js/sha256');
import { readFileSync } from 'graceful-fs';
import * as moment from 'moment';
import { join } from 'path';
import * as rp from 'request-promise';
import { getRepository } from 'typeorm';

export interface IWeatherData {
    temp: number;
    wind: number;
    weather: string;
    icon: string;
}

export type WeatherTime = 'today' | 'tomorrow' | 'afterTomorrow';

export class Weather {

    static async getWeather(city: string, time: WeatherTime = 'today') {
        const cityEnc = encodeURI(city);
        const cache_key = sha256(`weather_${city}`).toString();
        let value = cache.get(cache_key);
        if (value !== undefined) {
            return value;
        }
        const URI = `${this.getURI(time)}?q=${cityEnc}&units=metric&lang=ru&appid=${this.app_id}`;

        try {
            let response = JSON.parse(await rp.get(URI));
            if (time === 'tomorrow') {
                response = response.list[8];
            } else if (time === 'afterTomorrow') {
                response = response.list[16];
            }
            value = {
                temp: Math.round(response.main.temp),
                wind: Math.round(response.wind.speed),
                weather: this.capitalizeFirstLetter(response.weather[0].description.split(' ').slice(-1)[0]),
                icon: response.weather[0].icon
            };
            cache.set(cache_key, value);
            return value;
        } catch (error) {
            if (error.name === 'StatusCodeError') {
                log.error('Weather error: ', URI, error.message);
            } else {
                log.error('Weather error: ', error);
            }
            return null;
        }
    }

    static capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    static getURI(time: WeatherTime) {
        if (time === 'today') {
            return this.url;
        }

        return this.forecats_url;
    }

    static async getCities(query: string, limit: number = 20): Promise<WeatherCity[]> {
        const weatherCityRepository = getRepository(WeatherCity);

        return await weatherCityRepository.createQueryBuilder('wc')
            .where('wc.city_name LIKE :name', {
                name: `${query}%`
            })
            .orderBy('wc.city_name')
            .limit(limit)
            .getMany();
    }

    static async reloadCities() {
        const weatherCityRepository = getRepository(WeatherCity);

        await weatherCityRepository.createQueryBuilder('wc').delete().execute();

        const citiesData: CityJsonData[] = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'city.list.json')).toString());
        for (const city of citiesData) {
            const weatherCity = new WeatherCity();
            weatherCity.city_id = city.id.toString();
            weatherCity.city_name = city.name;
            weatherCity.country = city.country;
            weatherCity.coord_lat = city.coord.lat;
            weatherCity.coord_lon = city.coord.lon;
            await weatherCityRepository.save(weatherCity);
        }
    }

    private static readonly app_id: string = 'f554c849080b829915edc8b89395ca55';

    private static readonly url: string = 'http://api.openweathermap.org/data/2.5/weather';

    private static readonly forecats_url: string = 'http://api.openweathermap.org/data/2.5/forecast';
}

interface CityJsonData {
    id: number;
    name: string;
    country: string;
    coord: {
        lon: number,
        lat: number
    };
}
