import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Actor from './Actor'
import Pelicula from './Pelicula'

export default class Papel extends BaseModel {

  public static table = 'actores_peliculas'

  @column({ isPrimary: true })
  public id: number

  @column({serializeAs: null })
  public actor_id: number

  @column({serializeAs: null })
  public pelicula_id: number

  @column()
  public papel: string

  @column.dateTime({serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Actor, {
    localKey:'id',
    foreignKey:'actor_id'
  })
  public actor: BelongsTo<typeof Actor>

  @belongsTo(() => Pelicula, {
    localKey:'id',
    foreignKey:'pelicula_id'
  })
  public pelicula: BelongsTo<typeof Pelicula>
}
