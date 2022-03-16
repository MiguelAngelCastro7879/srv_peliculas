import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Persona from './Persona'

export default class Actor extends BaseModel {

  public static table = 'actores'

  @column({ isPrimary: true })
  public id: number

  @column({
    serializeAs: null,})
  public persona_id: number

  @column()
  public inicio_carrera: string

  @column()
  public final_carrera: string

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Persona, {
    localKey:'id',
    foreignKey:'persona_id'
  })
  public persona: BelongsTo<typeof Persona>
}
