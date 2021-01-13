'use strict';

import log from '@component/logger';
import { Translit } from '@component/translit';
import { BaseRoute } from '@route/base_router';
import { CurrencyService } from '@service/currencies';
import { Weather } from '@service/weather';
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

export class WeatherRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[WeatherRoute::create] Creating weather routes.');

        const route = new WeatherRoute();

        router.get('/api/v1/city/:name', route.findCity);
    }

    constructor() {
        super();
    }

    async findCity(req: Request, res: Response, next: NextFunction) {
        try {
            const cityName = req.param('name');
            if (!cityName) {
                res.status(400).json({
                    error: 'Название не может быть пустым'
                });
            } else {
                const cities = await Weather.getCities(Translit(cityName));
                res.json(cities.map((city) => {
                    return {
                        value: city.city_name,
                        label: `${city.city_name} (${city.coord_lat},${city.coord_lon})`
                    };
                }));
            }
        } catch (err) {
            log.error(err);
            res.sendStatus(500);
        }
    }
}
