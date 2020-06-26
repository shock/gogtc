import request from 'supertest'
import app from '../../Server'
import { cookieProps } from '../../shared/constants';
import { createAdminUser } from '../helpers/users'

import { setupKnex, teardownKnex } from '../helpers/knex'
import dbManager from '../../db/dbManager'

beforeAll( async () => {
  await setupKnex()
})

afterAll( async (done) => {
  await teardownKnex();
  await dbManager.close()
  await dbManager.closeKnex()
  done();
})

beforeEach( async () => {
  await dbManager.truncateDb(['knex_migrations', 'knex_migrations_lock'])
})

describe('Auth routes', () => {
  describe('POST /login', () => {
    describe('with valid user credentials', () => {
      it('should return 200', async (done) => {
        const user = await createAdminUser('password')
        request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password'
        })
        .expect(200)
        .end(done)
      });
      it('should set the JWT in a cookie', async (done) => {
        const user = await createAdminUser()
        request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password'
        })
        .expect(200)
        .expect('set-cookie', new RegExp(cookieProps.key))
        .end(done)
      });
    });
    describe('with invalid user credentials', () => {
      it('should return 401', async (done) => {

        request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password'
        })
        .expect(401)
        .end(done)
      });
    });
  })
  describe('GET /logout', () => {
    it('should expire the JWT cookie', async (done) => {
      request(app)
      .get('/api/auth/logout')
      .expect('set-cookie', new RegExp('Expires=Thu, 01 Jan 1970 00:00:00 GMT'))
      .end(done)
    });
  })
});