import request from 'supertest'
import app from '../../Server'
import { getKnex, setupKnex, teardownKnex, cleanTables } from '../helpers/knex'
import User from '../../models/User'
import { UserRoles } from '../../client_server/interfaces/User'
import { paramMissingError, loginFailedErr, cookieProps } from '../../shared/constants';

beforeAll( async () => {
  await setupKnex()
})

afterAll( async (done) => {
  await teardownKnex();
  done();
})

afterEach( async () => {
  await getKnex().table('users').del()
})

const createAdmin = async () => {
  return await User.query().insert({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    role: UserRoles.Admin
  })
}


describe('Auth routes', () => {
  describe('POST /login', () => {
    describe('with valid user credentials', () => {
      it('should return 200', async (done) => {
        const user = await createAdmin()
        request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password'
        })
        .expect(200)
        .end(done)
      });
      it('should set the JWT in a cookie', async (done) => {
        const user = await createAdmin()
        request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
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
});