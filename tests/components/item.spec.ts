import 'mocha';
import { expect } from 'chai';
import { TestFactory } from '../factory';

describe('Items controller', () => {

  const factory: TestFactory = new TestFactory();
  // todo mock data

  before(async () => {
    await factory.init();
  });

  after(async () => {
    await factory.close();
  });

  describe('GET /items', () => {
    it('should find all items and respond with status 200 OK', () => {
      factory.app.get('/api/items')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // Because the auth is not needed when node_env = test
        .expect(200);
    });

    it('add', async () => {
      //const promise: IItem[] = await itemService.findAll();
      // eslint-disable-next-line no-console
      // console.log(promise)
      const result = 3 + 4;
      expect(result).to.eq(7);
    });

  });


});
