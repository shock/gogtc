type _User = {
  id: number
  name: string
  email: string
  role: number
}

export type CreateUser = Omit<Omit<_User, 'role'>, 'id'> & { password: string }

export default _User