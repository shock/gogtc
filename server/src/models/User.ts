import Objection from 'objection'
import bcrypt from 'bcrypt'
import { Model, Modifiers } from 'objection'

import { BaseModel } from './BaseModel'
import IUser from '../client_server/interfaces/User'
import { JwtService } from '../shared/JwtService';
import yaml from 'js-yaml'

const jwtService = new JwtService();

export default class User extends BaseModel implements IUser {
  id!: number
  name!: string
  email!: string
  role!: number
  password!: string


  // Table name is the only required property.
  static tableName = 'users'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'role', 'password'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
      role: { type: 'integer' },
    }
  }

  async $beforeInsert(queryContext: Objection.QueryContext) {
    await super.$beforeInsert(queryContext)
    await this.updatePassword()
  }

  async $beforeUpdate(opt: Objection.ModelOptions, queryContext: Objection.QueryContext) {
    await super.$beforeUpdate(opt, queryContext)
    await this.updatePasswordIfChanged(opt.old)
  }

  async updatePassword() {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }

  async updatePasswordIfChanged(old:any) {
    if (old?.password) {
      const passwordMatches = await bcrypt.compare(this.password, old.password);
      if (!passwordMatches) {
        await this.updatePassword();
      }
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

  ////////////////////
  // Instance Methods
  ////////////////////

  async getJwtToken () {
    return await jwtService.getJwt({
      id: this.id,
      role: this.role,
    });
  }

  ////////////////////////////
  // YAML pseudo-constructor

  static fromYaml(yamlInput:string) {
    const obj = yaml.safeLoad(yamlInput);
    if( (obj === undefined) || ('string' === typeof obj) ) {
      throw new Error("invalid YAML string")
    } else {
      const userObj = obj as IUser
      const user = new User
      user.id = userObj.id
      user.name = userObj.name
      user.email = userObj.email
      user.role = userObj.role
      user.password = userObj.password
      return user
    }
  }
}