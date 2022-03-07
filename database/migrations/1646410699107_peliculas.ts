import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Peliculas extends BaseSchema {
  protected tableName = 'peliculas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre')
      table.text('descripcion')
      table.float('duracion')
      table.integer('calificacion')
      table.integer('clasificacion_id').unsigned().references('id').inTable('clasificaciones')
      table.integer('categoria_id').unsigned().references('id').inTable('categorias')
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
