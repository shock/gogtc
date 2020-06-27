import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('users', table => {
      table.bigIncrements('id').primary()
      table.string('name')
      table.string('email')
      table.string('password')
      table.integer('role')
      table.dateTime('created_at')
      table.dateTime('updated_at')

      table.unique(['email'])
    })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('users')
}
