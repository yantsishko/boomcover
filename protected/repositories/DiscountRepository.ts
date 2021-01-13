import { Discount } from '@entity/Discount';
import { Moment } from 'moment';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {

    findActive(date: Moment): Promise<Discount> {
        return this.createQueryBuilder('discount')
            .where(':date BETWEEN discount.from AND discount.to', {
                date: date.format('YYYY-MM-DD')
            })
            .orderBy('discount.percent', 'DESC')
            .getOne();
    }

}
