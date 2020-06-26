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
    describe('with no JWT cookie', () => {
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
    describe('with valid JWT cookie', () => {
      describe('with valid params', () => {
        it('should return 201 ', async (done) => {
          const user = await createRegularUser('password')
          const jwt = await user.getJwtToken()

          request(app)
          .post('/api/form_calcs/add')
            .send({
              name: 'fc1',
              json: '{}'
            })
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(201)
            .end(done)
        });
        it('should create a record in the DB ', async (done) => {
          const user = await createRegularUser('password')
          const jwt = await user.getJwtToken()

          request(app)
            .post('/api/form_calcs/add')
            .send({
              name: 'fc1',
              json: '{"a":"b"}'
            })
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(201)
            // .end()
            .end(async (err,res) => {
              if(err) return(done(err))
              const fcRecord = await FormCalc.findByUserIdAndName(user.id, 'fc1')
              expect(fcRecord).toBeTruthy()
              expect(fcRecord.name).toEqual('fc1')
              expect(fcRecord.json).toEqual({a:'b'})
              done()
            })
        });
      });
      describe('with invalid params', () => {
        it('it should return 400 ', async (done) => {
          const user = await createRegularUser('password')
          const jwt = await user.getJwtToken()

          request(app)
          .post('/api/form_calcs/add')
            .send({
              json: '{}'
            })
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(400)
            .end(done)
        });
      });
    })
  })
});