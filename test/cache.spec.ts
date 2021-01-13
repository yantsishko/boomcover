import { expect } from 'chai';
import cache from '../protected/components/cache';

describe('Cache', () => {
    it('Get set', async () => {
        cache.set('testtest', 123, 100);
        expect(cache.get('testtest')).to.be.eq(123);
    });
});
