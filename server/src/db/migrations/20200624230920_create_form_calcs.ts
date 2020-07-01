import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('form_calcs', table => {
      table.bigIncrements('id').primary()
      table.string('name').notNullable()
      table.string('description', 4096).notNullable().defaultTo('')
      table.json('json').notNullable().defaultTo('{}')
      table.boolean('preset').defaultTo(false).notNullable()
      table
        .bigInteger('user_id')
        .unsigned()
        // .references('id')
        // .inTable('users')
        // .onDelete('SET NULL')

      table.dateTime('created_at')
      table.dateTime('updated_at')

      table.unique(['user_id', 'name'])
      table.index(['user_id'])
    })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('form_calcs')
}
