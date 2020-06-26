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

require('repl.history')(replServer, process.env.HOME + '/.node_history');

replServer.context.db = models;
