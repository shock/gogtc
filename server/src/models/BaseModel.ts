import Objection, { Model, QueryBuilderType, Constructor, TransactionOrKnex } from 'objection'
import yaml from 'js-yaml'

const { QueryBuilder } = require('objection');

export class BaseModel extends Model {
  static debug = true
  created_at!: string
  updated_at!: string

  ///////////////////
  // Static methods

  static async first () {
    const records = await super.query().limit(1)
    return records[0]
  }

  static findAll () {
    return super.query()
  }

  static findOne (id:number) {
    return super.query().findById(id)
  }

  static create (data:Object) {
    return super.query().insert(data)
  }

  static update (id:number, data:Object) {
    return this.findOne(id).update(data)
  }

  static patch (id:number, data:Object) {
    return this.findOne(id).patch(data)
  }

  static delete (id:number) {
    return this.findOne(id).delete()
  }

  async $beforeInsert(queryContext: Objection.QueryContext) {
    await super.$beforeInsert(queryContext)
    this.created_at = new Date().toISOString()
  }

  async $beforeUpdate(opt: Objection.ModelOptions, queryContext: Objection.QueryContext) {
    await super.$beforeUpdate(opt, queryContext)
    this.updated_at = new Date().toISOString()
  }

  //////////////////////
  // Instance methods

  ///////////////
  // YAML Methods

  toYaml() {
    return yaml.safeDump(this)
  }

}