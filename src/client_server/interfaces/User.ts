type _User = {
  id: number
  name: string
  email: string
  role: number
}

export type LoginUser = Omit<Omit<Omit<Omit<_User, 'name'>, 'id'>, 'role'>, 'id'> & { password: string }
export type CreateUser = Omit<Omit<_User, 'role'>, 'id'> & { password: string }

export default _User