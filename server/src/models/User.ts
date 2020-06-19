import { Model, Modifiers } from 'objection'
import { BaseModel } from './BaseModel'

export default class User extends BaseModel {
  id!: number
  name!: string
  email!: string
  role!: number
  pwdHash!: string


  // Table name is the only required property.
  static tableName = 'users'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'role'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      pwdHash: { type: 'string', minLength: 1, maxLength: 255 },
      role: { type: 'integer' },
    }
  }

  // Modifiers are reusable query snippets that can be used in various places.
  static modifiers: Modifiers = {
    // Our example modifier is a a semi-dumb fuzzy name match. We split the
    // name into pieces using whitespace and then try to partially match
    // each of those pieces to both the `name` and the `email`
    // fields.
    searchBylogin(query, login) {
      // This `where` simply creates parentheses so that other `where`
      // statements don't get mixed with the these.
      query.where(query => {
        for (const login_part of login.trim().split(/\s+/)) {
          for (const column of ['name', 'email']) {
            query.orWhereRaw('lower(??) like ?', [column, login_part.toLowerCase() + '%'])
          }
        }
      })
    }
  }

  ////////////////////
  // QUERY SHORTCUTS
  ////////////////////

  static async findByEmail (email: string) {
    const response = await this.query().where({email:email})
    return response[0]
  }
}