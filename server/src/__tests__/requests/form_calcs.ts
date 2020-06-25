import request from 'supertest'
import app from '../../Server'
import { getKnex, setupKnex, teardownKnex, cleanTables } from '../helpers/knex'
import FormCalc from '../../models/FormCalc'
import { cookieProps } from '../../shared/constants';
import { createAdminUser, createRegularUser } from '../helpers/users'

beforeAll( async () => {
  await setupKnex('fc')
  console.log('knex setup fc')
})

afterAll( async (done) => {
  await teardownKnex('fc');
  console.log('knex torn down fc')
  done();
})

const createFormCalc = async (name:string, json:any) => {
  return await FormCalc.query().insert({
    name: name,
    json: JSON.stringify(json)
  })
}


describe('FormCalc routes', () => {
  afterEach( async (done) => {
    await cleanTables('fc')
    console.log('tables cleaned fc')
    done()
  })
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
        getKnex().table('users').del()
        const user = await createAdminUser()
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