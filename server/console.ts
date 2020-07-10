/**
 * add console.js at ther root of your app
 * Modify to make it more helpful for your project
 * > Note: `esm` adds ES6 support in Node
 * In package.json
 *  ...
 *  "scripts": {
 *    "start": "nodemon -r esm ./server.js"
 *    "console": "node -r esm --experimental-repl-await console",
 *  }
 *
 * check whether you have yarn installed
 * $ yarn -v
 * 1.12.3
 * If not then install it using
 * $ npm install -g yarn
 * /usr/local/bin/yarn -> /usr/local/lib/node_modules/yarn/bin/yarn.js
 *  /usr/local/bin/yarnpkg -> /usr/local/lib/node_modules/yarn/bin/yarn.js
 *  + yarn@1.12.3
 * updated 1 package in 1.459s
 *
 * Now you can run command
 * $ yarn console
 * app > // Here we have all sequelize models
 * app > (await User.findOne()).toJSON() // return {..user} json object
 */

import repl from 'repl';
import * as models from './src/models';
import Knex from 'knex'
import { Model, ForeignKeyViolationError, ValidationError } from 'objection'
import knexConfig from './src/db/knexfile'
import bcrypt from 'bcrypt';
const replHistory = require('repl.history')
import csv from 'csv'
import fs from 'fs'
import yaml from 'js-yaml'

global['csv'] = csv;
global['fs'] = fs;

// replHistory(repl, process.env.HOME + '/.node_history')

Object.keys(models).forEach(modelName => {
  global[modelName] = models[modelName];
});

// Initialize knex.
const knex = Knex(knexConfig.development)

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex)

global['logp'] = (it:Promise<any>) => {
  it.then((resp) => console.log(resp))
}

global['knex'] = knex
global['a'] = { v: null }
global['av'] = (it:Promise<any>) => {
  it.then((resp) => {
    console.log(resp)
    global['a'].v = resp
  })
}

const setupQuery = (model:any):Promise<any> => model.query()

global['q'] = setupQuery

const replServer = repl.start({
  prompt: 'server > '
});


const parseTroopDataCsv = () => {
  const csvData = fs.readFileSync('../data/troop_info.csv', 'utf-8')
  let parsedRecords
  csv.parse(csvData, (err, res) => {
    parsedRecords = res
    const headers = parsedRecords.shift()
    const mappedRecords = parsedRecords.map(record => {
      const obj = {}
      record.forEach((field, index) => {
        const fieldName = headers[index]
        if( fieldName.match(/health|attack|defense|speed|power|load|upkeep/) ) {
          field = Number(field)
        }
        obj[fieldName] = field
      })
      return obj
    })
    const yml = yaml.dump(mappedRecords)
    console.log(yml)
  })
}

const parseTroopDataYaml = () => {
  const ymlData = fs.readFileSync('../data/troop_info.yml', 'utf-8')
  const ymlRecords = yaml.safeLoad(ymlData)
  console.log(ymlRecords)
}
const savePresetsToFile = async () => {
  const presets = await models.FormCalc.findAll().where('preset', true).orderBy('id')
  const yml = yaml.safeDump(presets.map(formCalc => {
    delete formCalc['id']
    delete formCalc['created_at']
    delete formCalc['updated_at']
    delete formCalc['user_id']
    return formCalc
  }))
  fs.writeFileSync('src/db/formCalcPresets.yml', yml, 'utf-8')
}

// parseTroopDataCsv()
// parseTroopDataYaml()

require('repl.history')(replServer, process.env.HOME + '/.node_history');

replServer.context.db = models;
replServer.context.dumpPresets = savePresetsToFile;
