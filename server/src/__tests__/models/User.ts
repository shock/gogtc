import bcrypt from 'bcrypt'
import User from '../../models/User'
import { UserRoles } from '../../client_server/interfaces/User'
import { setupKnex, teardownKnex } from '../helpers/knex'
import dbManager from '../../db/dbManager'
import { createAdminUser, createRegularUser } from '../helpers/users'

beforeAll( async () => {
  await setupKnex()
})

afterAll( async (done) => {
  await teardownKnex()
  await dbManager.close()
  await dbManager.closeKnex()
  done();
})

beforeEach( async () => {
  await dbManager.truncateDb(['knex_migrations', 'knex_migrations_lock'])
})

it('can update password when a user is already saved', async () => {
  const user = await createRegularUser('foo')
  const passwordMatches = await bcrypt.compare('foo', user.password)
  expect(passwordMatches).toBeTruthy()
  expect(user.password).not.toBe('foo')
  const updatedUser = await user.$query().patchAndFetch({ password: 'bar' })
  expect(user.password).not.toBe('bar')
  expect(user.password).not.toBe('foo')
  const updatedPasswordMatches = await bcrypt.compare('bar', updatedUser.password)
  expect(updatedPasswordMatches).toBeTruthy()
});
