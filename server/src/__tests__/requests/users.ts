import request from 'supertest'
import app from '../../Server'
import Knex from 'knex'
import { Model } from 'objection'
import knexConfig from '../../db/knexfile'

// Initialize knex.
const knex = Knex(knexConfig.development)

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex)

afterAll((done) => {
  knex.destroy();
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