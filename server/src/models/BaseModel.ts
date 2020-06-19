import { Model, QueryBuilderType, Constructor, TransactionOrKnex } from 'objection'

export class BaseModel extends Model {
  static debug = true

  static findAll () {
    return this.query()
  }

  static findOne (id:number) {
    return this.query().findById(id)
  }

  static create (data:Object) {
    return this.query().insert(data)
  }

  static update (id:number, data:Object) {
    return this.findOne(id).update(data)
  }

  static delete (id:number) {
    return this.findOne(id).delete()
  }

}