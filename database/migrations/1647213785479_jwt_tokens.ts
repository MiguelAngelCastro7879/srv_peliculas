import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class JwtTokens extends BaseSchema {
  protected tableName = 'jwt_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('refresh_token').notNullable()
      table.string('refresh_token_expires_at').notNullable()
      table.string('type').notNullable()
      table.string('token', 64).notNullable().unique()
      table.date('expires_at')
      table.timestamp('created_at', { precision: 6 }).nullable()
      table.timestamp('updated_at', { precision: 6 }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
