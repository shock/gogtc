import _User from '../../../client_server/interfaces/User'

export class MUser implements _User {
  id!: number
  name!: string
  email!: string
  role!: number
}

export default MUser