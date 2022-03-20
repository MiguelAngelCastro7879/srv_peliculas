import { column } from '@ioc:Adonis/Lucid/Orm'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Alterpelis extends BaseSchema {
  protected tableName = 'peliculas'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('imagenes').notNullable().after('nombre')
    })
  }

  public async down () {
    this.schema.dropTableIfExists('imagenes')
  }
}
