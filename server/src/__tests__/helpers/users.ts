import User from '../../models/User'
import { UserRoles } from '../../client_server/interfaces/User'
import faker from 'faker'

export const createAdminUser = async (password = 'password') => {
  return await User.query().insert({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: password,
    role: UserRoles.Admin
  })
}

export const createRegularUser = async (password = 'password') => {
  return await User.query().insert({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: password,
    role: UserRoles.Standard
  })
}
