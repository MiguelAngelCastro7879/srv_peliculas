import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ActoresPeliculas extends BaseSchema {
  protected tableName = 'actores_peliculas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('actor_id').unsigned().references('id').inTable('actores')
      table.integer('pelicula_id').unsigned().references('id').inTable('peliculas')
      table.string('papel')
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
