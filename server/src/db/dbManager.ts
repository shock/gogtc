import knexConfig from './knexfile'
import _dbManager from 'knex-db-manager'

const config = {
  knex: knexConfig.test,
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