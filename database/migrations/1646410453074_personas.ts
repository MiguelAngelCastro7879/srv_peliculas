import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Personas extends BaseSchema {
  protected tableName = 'personas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre')
      table.date('f_nacimiento')
      table.string('nacionalidad')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { precision: 6 })
      table.timestamp('updated_at', { precision: 6 })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
