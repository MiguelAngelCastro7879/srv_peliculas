import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Idioma extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @manyToMany(() => Idioma, {
    pivotTable: 'peliculas_idiomas',
    pivotRelatedForeignKey: 'pelicula_id',
    pivotForeignKey: 'idioma_id',
    relatedKey: 'id',
    localKey: 'id',
  })
  public idioma: ManyToMany<typeof Idioma>
}
