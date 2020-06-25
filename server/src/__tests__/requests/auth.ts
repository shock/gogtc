import request from 'supertest'
import app from '../../Server'
import { getKnex, setupKnex, teardownKnex, cleanTables } from '../helpers/knex'
import { cookieProps } from '../../shared/constants';
import { createAdminUser } from '../helpers/users'

beforeAll( async () => {
  await setupKnex('auth')
  console.log('knex setup auth')
})

afterAll( async (done) => {
  await teardownKnex('auth');
  console.log('knex torn down auth')
  done();
})


describe('Auth routes', () => {
  afterEach( async (done) => {
    await cleanTables('auth')
    console.log('tables cleaned auth')
    done()
  })
  describe('POST /login', () => {
    describe('with valid user credentials', () => {
      it('should return 200', async (done) => {
        const user = await createAdminUser()
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