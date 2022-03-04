import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Actores extends BaseSchema {
  protected tableName = 'actores'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('persona_id').unsigned().references('id').inTable('personas')
      table.integer('pelicula_id').unsigned().references('id').inTable('peliculas')
      table.string('papel')
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
