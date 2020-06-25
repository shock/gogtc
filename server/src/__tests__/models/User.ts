import bcrypt from 'bcrypt'
import User from '../../models/User'
import { UserRoles } from '../../client_server/interfaces/User'
import { setupKnex, teardownKnex } from '../helpers/knex'

beforeAll( async () => {
  await setupKnex('Users.ts')
})

afterAll( async (done) => {
  await teardownKnex('Users.ts');
  done();
});

test.only('can update password when a user is already saved', async () => {
  const user = await User.query().insert({
    name: 'John',
    email: 'email@email.com',
    password: 'foo',
    role: UserRoles.Standard
  })
  const passwordMatches = await bcrypt.compare('foo', user.password)
  expect(user.password).not.toBe('foo')
  expect(passwordMatches).toBeTruthy()
  const updatedUser = await user.$query().patchAndFetch({ password: 'bar' })
  expect(user.password).not.toBe('bar')
  expect(user.password).not.toBe('foo')
  const updatedPasswordMatches = await bcrypt.compare('bar', updatedUser.password)
  expect(updatedPasswordMatches).toBeTruthy()
});
