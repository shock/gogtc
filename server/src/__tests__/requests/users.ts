import request from 'supertest'
import app from '../../Server'
import { bindKnex, destroyKnex } from '../helpers/knex'

beforeAll( () => {
  bindKnex()
})

afterAll( async (done) => {
  await destroyKnex();
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
    it('should work', (done) => {
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