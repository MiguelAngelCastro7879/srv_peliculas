import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Pelicula from './Pelicula'


export default class Productora extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public presidente: string

  @column()
  public propietario: string

  @column()
  public sitio_web: string

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Pelicula, {
    pivotTable: 'peliculas_productoras',
    pivotRelatedForeignKey: 'pelicula_id',// pelicula_id column on "Pelicula" model
    pivotForeignKey: 'productora_id',// Productora_id column on "peliculas_Productora" model
    relatedKey: 'id', // id column on "Pelicula" model
    localKey: 'id', // id column on "Productora" model
  })
  public peliculas: ManyToMany<typeof Pelicula>
}
