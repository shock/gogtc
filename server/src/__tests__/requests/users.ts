import request from 'supertest'
import app from '../../Server'
import { setupKnex, teardownKnex } from '../helpers/knex'
import User from '../../models/User'
import { UserRoles } from '../../client_server/interfaces/User'

beforeAll( async () => {
  await setupKnex()
})

afterAll( async (done) => {
  await teardownKnex();
  done();
});

describe('hello world', () => {
  it('should work', (done) => {
    request(app)
    .get('/hello')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.body['hello']).toEqual('world')
    })
    .end(done)
  });
});

describe('Auth routes', () => {
  describe('POST /api/auth/login', () => {
    it('should work', async (done) => {
      const user = await User.query().insert({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password',
        role: UserRoles.Admin
      });

      request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password'
      })
      .expect(200)
      .end(done)
    });
  })
});