export type User = {
  id: number
  name: string
  email: string
  role: number
  password: string
}

export type LoginUser = Omit<Omit<Omit<Omit<User, 'name'>, 'id'>, 'role'>, 'id'> & { password: string }
export type CreateUser = Omit<Omit<User, 'role'>, 'id'> & { password: string }

export enum UserRoles {
  Standard,
  Admin,
}

export default User