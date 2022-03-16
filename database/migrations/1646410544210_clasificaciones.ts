import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clasificaciones extends BaseSchema {
  protected tableName = 'clasificaciones'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre')
      table.text('descripcion')
      table.integer('edad_minima')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { precision: 6 }).nullable()
      table.timestamp('updated_at', { precision: 6 }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
