import request from 'supertest'
import app from '../../Server'
import FormCalc from '../../models/FormCalc'
import { cookieProps } from '../../shared/constants';
import { createAdminUser, createRegularUser } from '../helpers/users'

import { setupKnex, teardownKnex } from '../helpers/knex'
import dbManager from '../../db/dbManager'

beforeAll( async () => {
  await setupKnex()
})

afterAll( async (done) => {
  await teardownKnex();
  // console.log('knex torn down auth')
  await dbManager.close()
  await dbManager.closeKnex()
  done();
})

beforeEach( async () => {
  await dbManager.truncateDb(['knex_migrations', 'knex_migrations_lock'])
})

const createFormCalc = async (name:string, json:any) => {
  return await FormCalc.query().insert({
    name: name,
    json: JSON.stringify(json)
  })
}


describe('FormCalc routes', () => {
  describe('POST /add', () => {
    describe('when user is not logged in', () => {
      it('should return 401 ', async (done) => {
        request(app)
        .post('/api/form_calcs/add')
        .send({
          name: 'fc1',
          json: '{}'
        })
        .expect(401)
        .end(done)
      });
    })
    describe('when user is logged in', () => {
      it('should return 200 ', async (done) => {
        const user = await createAdminUser('password')
        const agent = request.agent(app)
        request(app)
          .post('/api/auth/login')
          .send({
            email: user.email,
            password: 'password'
          })
          .expect(200)
          .expect('set-cookie', new RegExp(cookieProps.key))
          .end(done)
          // .end((err, res) => { if(err) return done(err) })

        // done()
        // agent
        //   .post('/api/form_calcs/add')
        //   .send({
        //     name: 'fc1',
        //     json: '{}'
        //   })
        //   .expect(200)
        //   .end(done)

      });
    })
  })
});