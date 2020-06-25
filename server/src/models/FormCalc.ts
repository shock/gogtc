import { Modifiers } from 'objection'
import { BaseModel } from './BaseModel'
import IFormCalc from '../client_server/interfaces/FormCalc'

export default class FormCalc extends BaseModel implements IFormCalc {
  id!: number
  name!: string
  description!: string
  data!: string

  // Table name is the only required property.
  static tableName = 'form_calcs'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name', 'data'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 0, maxLength: 4096 },
    }
  }

  ////////////////////
  // QUERY SHORTCUTS
  ////////////////////

}