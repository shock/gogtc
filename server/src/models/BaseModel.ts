import Objection, { Model, QueryBuilderType, Constructor, TransactionOrKnex } from 'objection'

export class BaseModel extends Model {
  static debug = true
  created_at!: string
  updated_at!: string

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

}