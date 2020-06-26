import Knex from 'knex'
import { Model } from 'objection'
import knexConfig from '../../db/knexfile'

let knex:Knex<any, unknown[]>;

export const setupKnex = async () => {
  // Initialize knex.
  knex = Knex(knexConfig.test)

  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex() method.
  Model.knex(knex)
  // await cleanTables()
}

export const teardownKnex = async () => {
  await knex.destroy()
}

export const cleanTables = async () => {
  await knex.table('users').del()
  await knex.table('form_calcs').del()
}

export const getKnex = () => knex
