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
import * as models from './features/form_calc/models'

const Global = global as any
Global.foo = 'foo'

Global['logp'] = (it:Promise<any>) => {
  it.then((resp) => console.log(resp))
}

Global.TroopData = models.TroopData

Global['a'] = { v: null }
Global['av'] = (it:Promise<any>) => {
  it.then((resp) => {
    console.log(resp)
    Global['a'].v = resp
  })
}

const replServer = repl.start({
  prompt: 'client > '
});

// require('repl-history')(replServer, process.env.HOME + '/.node_history');
require('repl.history')(replServer, process.env.HOME + '/.node_history');
