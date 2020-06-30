import knexConfig from './knexfile'
import _dbManager from 'knex-db-manager'

let kCfg

switch(process.env.NODE_ENV) {
  case 'test':
    kCfg = knexConfig.test
    break
  case 'development':
    kCfg = knexConfig.development
    break
  default:
    throw new Error('process.env.NODE_ENV undefined')
}

const config = {
  knex: kCfg,
  dbManager: {
    // db manager related configuration
    // collate: ['fi_FI.UTF-8', 'Finnish_Finland.1252'],
    superUser: 'billdoughty',
    superPassword: '',
    populatePathPattern: 'data/**/*.js', // glob format for searching seeds
  }
}

const dbManager = _dbManager.databaseManagerFactory(config)

export default dbManager