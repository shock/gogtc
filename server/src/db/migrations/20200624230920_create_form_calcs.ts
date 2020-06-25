import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('form_calcs', table => {
      table.bigIncrements('id').primary()
      table.string('name').notNullable()
      table.string('description', 4096).notNullable().defaultTo('')
      table.json('json').notNullable().defaultTo('{}')
      table.boolean('preset').defaultTo(false)
      table
        .bigInteger('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .index()

      table.index(['user_id', 'name'])
    })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('form_calcs')
}