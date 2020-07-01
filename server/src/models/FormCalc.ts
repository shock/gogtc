import { Modifiers } from 'objection'
import yaml from 'js-yaml'

import { BaseModel } from './BaseModel'
import IFormCalc from '../client_server/interfaces/FormCalc'

export default class FormCalc extends BaseModel implements IFormCalc {
  id!: number
  name!: string
  description!: string
  json!: string
  user_id!: number | null
  preset!: boolean

  // Table name is the only required property.
  static tableName = 'form_calcs'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name', 'json'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 0, maxLength: 4096 },
    }
  }

  ////////////////////
  // QUERY SHORTCUTS
  ////////////////////

  static findByUserId(userId:number) {
    return this.query().where('user_id', userId)
  }
  static async findByUserIdAndName(userId:number, name:string) {
    const results = await this.query().where('user_id', userId).where('name', name)
    return results[0]
  }

  async $reload () {
    return this.$query().where('id', this.id)
  }

  ////////////////////////////
  // YAML pseudo-constructor

  static fromYaml(yamlInput:string) {
    const obj = yaml.safeLoad(yamlInput);
    if( (obj === undefined) || ('string' === typeof obj) ) {
      throw new Error("invalid YAML string")
    } else {
      const fcObj = obj as IFormCalc
      const formCalc = new FormCalc
      formCalc.id = fcObj.id
      formCalc.name = fcObj.name
      formCalc.description = fcObj.description
      formCalc.json = fcObj.json
      formCalc.preset = fcObj.preset
      return formCalc
    }
  }
}