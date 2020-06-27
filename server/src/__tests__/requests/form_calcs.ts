import request from 'supertest'
import app from '../../Server'
import FormCalc from '../../models/FormCalc'
import { cookieProps } from '../../shared/constants';
import { createAdminUser, createRegularUser } from '../helpers/users'

import { setupKnex, teardownKnex } from '../helpers/knex'
import dbManager from '../../db/dbManager'
import faker from 'faker'

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

const createUserFormCalc = async (name:string, json:any) => {
  const user = await createRegularUser('password')
  const jwt = await user.getJwtToken()
  const formCalc = await FormCalc.query().insert({
    name: name,
    json: JSON.stringify(json),
    user_id: user.id
  })
  return { formCalc, user, jwt }
}

describe('FormCalc routes', () => {
  const formCalc = {
    name: faker.random.word(),
    json: '{"a":"b"}'
  }
  describe('POST /create', () => {
    describe('with no JWT cookie', () => {
      it('should return 401 ', async (done) => {
        request(app)
          .post('/api/form_calcs/create')
          .send(formCalc)
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
            .post('/api/form_calcs/create')
            .send(formCalc)
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(201)
            .end(done)
        });
        it('should create a record in the DB ', async (done) => {
          const user = await createRegularUser('password')
          const jwt = await user.getJwtToken()
          request(app)
            .post('/api/form_calcs/create')
            .send(formCalc)
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(201)
            .end(async (err,res) => {
              if(err) return(done(err))

              const resObj = res.body
              expect(resObj.name).toEqual(formCalc.name)
              expect(resObj.json).toEqual(formCalc.json)
              expect(resObj.user_id).toEqual(user.id.toString())

              const fcRecord = await FormCalc.findByUserIdAndName(user.id, formCalc.name)
              expect(fcRecord).toBeTruthy()
              expect(fcRecord.name).toEqual(formCalc.name)
              expect(fcRecord.json).toEqual(JSON.parse(formCalc.json))
              done()
            })
        });
      });
      describe('with invalid params', () => {
        it('it should return 400 ', async (done) => {
          const user = await createRegularUser('password')
          const jwt = await user.getJwtToken()

          request(app)
            .post('/api/form_calcs/create')
            .send({ json: '{}' })
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(400)
            .end(done)
        });
      });
    })
  })
  describe('PUT /update/:id', () => {
    describe('with no JWT cookie', () => {
      it('should return 401 ', async (done) => {
        request(app)
        .put('/api/form_calcs/update/1')
        .send(formCalc)
        .expect(401)
        .end(done)
      });
    })
    describe('with valid JWT cookie', () => {
      describe('with valid params', () => {
        it('should return 200', async (done) => {
          const { formCalc, jwt } = await createUserFormCalc('fc1', {a:'b'})
          request(app)
            .put(`/api/form_calcs/update/${formCalc.id}`)
            .send(formCalc)
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(200)
            .end(done)
        });
        it('should update the record in the DB', async (done) => {
          const { formCalc, user, jwt } = await createUserFormCalc('fc1', {a:'b'})
          formCalc.name = 'newName'
          request(app)
            .put(`/api/form_calcs/update/${formCalc.id}`)
            .send(formCalc)
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(200)
            .end(async (err,res) => {
              if(err) return(done(err))
              expect(res.body).toEqual(1)
              const fcRecord = await formCalc.$reload()
              expect(fcRecord).toBeTruthy()
              expect(fcRecord.name).toEqual(formCalc.name)
              expect(fcRecord.json).toEqual(JSON.parse(formCalc.json))
              done()
            })
        });
      });
      describe('with invalid params', () => {
        it('it should return 400 ', async (done) => {
          const { formCalc, jwt } = await createUserFormCalc('fc1', {a:'b'})

          request(app)
            .put(`/api/form_calcs/update/${formCalc.id}`)
            .send({ asdf: '{}' })
            .set('Cookie', [`${cookieProps.key}=${jwt}`])
            .expect(400)
            .end(done)
        });
      });
    })
  })
});