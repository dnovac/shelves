import { expect } from 'chai';
import 'mocha';
import { TestFactory } from './factory';

describe('Item component', () => {

  const factory: TestFactory = new TestFactory();
  // todo mock data

  before(async () => {
    await factory.init();
  });

  after(async () => {
    await factory.close();
  });

  describe('GET /items', () => {
    it('responds with status 403 Forbidden', (done) => {
      factory.app.get('/api/items')
        .send()
        .set('Accept', 'application/json')
        .expect(403, done);
    });

    it('add', async () => {
      //const promise: IItem[] = await itemService.findAll();
      // eslint-disable-next-line no-console
      // console.log(promise)
      let result = 3 + 4;
      expect(result).to.eq(7);
    });

  });


});
