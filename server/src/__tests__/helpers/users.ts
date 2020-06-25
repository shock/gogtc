import User from '../../models/User'
import { UserRoles } from '../../client_server/interfaces/User'

export const createAdminUser = async () => {
  console.log('creating admin user')
  return await User.query().insert({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    role: UserRoles.Admin
  })
}

export const createRegularUser = async () => {
  console.log('creating regular user')
  return await User.query().insert({
    name: 'Regular',
    email: 'reg@example.com',
    password: 'password',
    role: UserRoles.Standard
  })
}
