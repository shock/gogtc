import * as models from '../models';
import Knex from 'knex'
import { Model, ForeignKeyViolationError, ValidationError } from 'objection'
import knexConfig from './knexfile'

// Initialize knex.
const knex = Knex(knexConfig.development)

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex)

const Seeds:any = {
  modelNameMap: {
    User: models.User
  },
  seedData: {
    "User": [
      {
        "name":"Sean Maxwell",
        "email":"sean.maxwell@gmail.com",
        "password":"$2b$10$.NY6ZPprXeqfHGHYPo3TDOmgIVpEn/hpR4nS01hiVFjd8Aj.7GrPC", // password is "password"
        "role":1
      },
      {
        "name":"Admin",
        "email":"admin@example.com",
        "password":"$2b$10$.NY6ZPprXeqfHGHYPo3TDOmgIVpEn/hpR4nS01hiVFjd8Aj.7GrPC",
        "role":1
      },
      {
        "name":"Super Admin",
        "email":"admin@test.com",
        "password":"$2b$10$.NY6ZPprXeqfHGHYPo3TDOmgIVpEn/hpR4nS01hiVFjd8Aj.7GrPC",
        "role":1
      },
      {
        "name":"Gordan Freeman",
        "email":"gordan.freeman@halflife.com",
        "password":"$2b$10$.NY6ZPprXeqfHGHYPo3TDOmgIVpEn/hpR4nS01hiVFjd8Aj.7GrPC",
        "role":0
      },
      {
        "name":"John Smith",
        "email":"jsmith@yahoo.com",
        "password":"$2b$10$.NY6ZPprXeqfHGHYPo3TDOmgIVpEn/hpR4nS01hiVFjd8Aj.7GrPC",
        "role":0
      }
    ]
  }
}

const doInserts = (model:any, records:any) => {
  return Promise.all(records.map( async (record:any) => {
    try {
      const response = await model.query().insert(record)
      console.log(`inserted ${JSON.stringify(response)}`)
      return response
    } catch (e) {
      console.log(`insert failed for ${JSON.stringify(record)}`)
      console.log(e.message)
      return null
    }
  }))
}

Promise.all(
  Object.keys(Seeds.modelNameMap).map( modelName => {
    const model = Seeds.modelNameMap[modelName]
    const tableName = model.tableName
    const records = Seeds.seedData[modelName as string]
    return doInserts(model, records)
  })
).finally( () => process.exit() )
