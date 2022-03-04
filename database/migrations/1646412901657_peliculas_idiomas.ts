import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PeliculasIdiomas extends BaseSchema {
  protected tableName = 'peliculas_idiomas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('pelicula_id').unsigned().references('id').inTable('peliculas')
      table.integer('idioma_id').unsigned().references('id').inTable('idiomas')
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
