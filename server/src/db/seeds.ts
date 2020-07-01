import '../loadEnv'; // Must be the first import
import * as models from '../models';
import Knex from 'knex'
import yaml from 'js-yaml'
import fs from 'fs'
import { Model, ForeignKeyViolationError, ValidationError } from 'objection'
import knexConfig from './knexfile'
import dbManager from './dbManager'

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
        "name":"regular user",
        "email":"user@example.com",
        "password":"password", // password is "password"
        "role":0
      },
      {
        "name":"Admin",
        "email":"admin@example.com",
        "password":"password",
        "role":1
      },
      {
        "name":"Super Admin",
        "email":"admin@test.com",
        "password":"password",
        "role":1
      },
      {
        "name":"Gordan Freeman",
        "email":"gordan.freeman@halflife.com",
        "password":"password",
        "role":0
      },
      {
        "name":"John Smith",
        "email":"jsmith@yahoo.com",
        "password":"password",
        "role":0
      }
    ]
  }
}

const doInserts = (model:any, records:any) => {
  return Promise.all(records.map( async (record:any) => {
    try {
      const response = await model.query().insert(record)
      console.log(`inserted ${model.tableName}[${response.id}]`)
      return response
    } catch (e) {
      console.log(`insert failed for ${JSON.stringify(record)}`)
      console.log(e.message)
      return null
    }
  }))
}

const userPromises = Object.keys(Seeds.modelNameMap).map( modelName => {
  const model = Seeds.modelNameMap[modelName]
  const tableName = model.tableName
  const records = Seeds.seedData[modelName as string]
  console.log('building userPromises')
  return doInserts(model, records)
})

const formCalcPresetsFile = `${__dirname}/formCalcPresets.yml`
const presetsData = yaml.safeLoad(fs.readFileSync(formCalcPresetsFile, 'utf8'))
if( !presetsData || !(presetsData instanceof Array) || ('string' === typeof presetsData)) {
  throw new Error('invalid YAML data')
}

const fcPromises = () => {
  return doInserts(models.FormCalc, presetsData)
}

// const dbPromises = userPromises.concat(fcPromises())

const doit = async () => {
  console.log('Truncating DB')
  await dbManager.truncateDb(['knex_migrations', 'knex_migrations_lock'])
  console.log('DB Truncated')
  await fcPromises()
  await Promise.all( userPromises )
}

doit().catch(error => {
  console.error(error)
  process.exit()
}).finally( () => process.exit() )
