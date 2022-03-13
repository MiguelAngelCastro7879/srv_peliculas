import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Pelicula from './Pelicula'

export default class PeliculaIdioma extends BaseModel {

  public static table = 'peliculas_idiomas'

  @column({ isPrimary: true })
  public id: number


  @column()
  public idioma_id: number

  @column()
  public pelicula_id: number

  @belongsTo(() => Pelicula, {
    localKey:'id',
    foreignKey:'pelicula_id'
  })
  public pelicula: BelongsTo<typeof Pelicula>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
