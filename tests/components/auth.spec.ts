import 'mocha';
import { assert, expect } from 'chai';
import { Container } from 'typedi';
import { User } from '../../src/model/User';
import { UserService } from '../../src/service/user-service';
import { TestFactory } from '../factory';

describe('Authentication', () => {
  const factory: TestFactory = new TestFactory();
  const testUser: User = new User({
    username: 'test_username',
    age: 200,
    email: 'test@email.com',
    firstName: 'TestFirstName',
    lastName: 'TestLastName',
    password: 'Test123',
  });

  before(async () => {
    await factory.init();
  });

  after(async () => {
    // Delete the created user
    const userService: UserService = Container.get(UserService);
    const createdTestUser = await userService.findByEmail(testUser.email);
    if (createdTestUser) {
      await userService.delete((createdTestUser.id).toString());
    }

    await factory.close();
  });

  describe('POST /users/register', () => {

    it('responds with status 400, email is mandatory', (done) => {
      factory.app
        .post('/api/users/register')
        .send({
          username: testUser.username,
          age: testUser.age,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          password: testUser.password,
        })
        .set('Accept', 'application/json')
        .expect(400, done)
    });

    it('responds with status 400, username is mandatory', (done) => {
      factory.app
        .post('/api/users/register')
        .send({
          email: testUser.email,
          age: testUser.age,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          password: testUser.password,
        })
        .set('Accept', 'application/json')
        .expect(400, done)
    });

    it('responds with status 200, returns auth token', (done) => {
      factory.app
        .post('/api/users/register')
        .send({
          username: testUser.username,
          email: testUser.email,
          age: testUser.age,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          password: testUser.password,
        })
        .set('Accept', 'application/json')
        .expect(200, done);
    });

  });

  describe('POST /users/login', () => {
    it('responds with status 400', () => {
      factory.app
        .post('/api/users/login')
        .send()
        .set('Accept', 'application/json')
        .expect(400)
    });

    it('responds with status 401', () => {
      factory.app
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongPass',
        })
        .set('Accept', 'application/json')
        .expect(401)
    });

    it('responds with bearer token, status 200', () => {
      factory.app
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password,
          username: testUser.username,
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const { token } = res.body;

          expect(token).to.exist;
          assert.isString(token, 'token should be a string');
        });

    });

  });

});
