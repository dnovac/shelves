import 'mocha';
import { TestFactory } from '../factory';
import { ItemService } from '../../src/service/item-service';
import { Container } from 'typedi';
import { expect } from 'chai';
import { CollectionService } from '../../src/service/collection-service';
import { UserService } from '../../src/service/user-service';
import { IUser } from '../../src/model/i-user';


describe('Items controller', () => {

  // TODO will need a setup and teardown for whole db
  const factory: TestFactory = new TestFactory();
  let itemService: ItemService;
  let collectionService: CollectionService;


  before(async () => {
    await factory.init();
    itemService = Container.get(ItemService);
    collectionService = Container.get(CollectionService);
  });

  after(async () => {
    await factory.close();
  });

  describe('GET /items', () => {
    it('should find all items and respond with status 200 OK', (done) => {
      factory.app.get('/api/items')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // Because the auth is not needed when node_env = test
        .expect(200, done);
    });

    it('should find all items and related collections', (done) => {
      factory.app.get('/api/items')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          // const items: IItem[] = res.body;
          // TODO: need to init another db and on before create items and on after delete them and only expect the ones created.
          // expect(items).to.exist;
          // expect(items).to.not.be.empty;
          // expect(items.length).to.eq(1);
          done();
        });
    });
  });

  describe('GET /items/:id', () => {
    it('should find item by id and respond with status 200 OK', async () => {
      // Create User
      // TODO: move it at the .spec file level
      const testUser: IUser = await Container.get(UserService)
        .save(
          {
            username: 'test_username',
            age: 200,
            email: 'test@email.com',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            password: 'Test123',
          });

      const collection = await collectionService.save({
        title: "test-items-collection",
        user: testUser
      })
      const item = await itemService.save({
        title: 'TestItem',
        url: 'test-url-item',
        imageUrl: 'test-image-url-item',
        collection: collection,
      });
      const itemId = item.id;

      factory.app.get(`/api/items/${itemId}`)
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // Because the auth is not needed when node_env = test
        .expect(200, (err, res) => {
          expect(res.body).to.not.be.null;
        });
    });

  });


});
