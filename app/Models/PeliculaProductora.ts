import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Pelicula from './Pelicula'

export default class PeliculaProductora extends BaseModel {

  public static table = 'peliculas_productoras'

  @column({ isPrimary: true })
  public id: number

  @column()
  public productora_id: number

  @column()
  public pelicula_id: number

  @belongsTo(() => Pelicula, {
    localKey:'id',
    foreignKey:'pelicula_id'
  })
  public pelicula: BelongsTo<typeof Pelicula>

  @column.dateTime({
    serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
