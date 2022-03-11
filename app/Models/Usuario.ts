import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Persona from './Persona'

export default class Usuario extends BaseModel {

  @column({ isPrimary: true})
  public id: number

  @column()
  public username:string

  @column()
  public email:string

  @column({
    serializeAs: null,
   })
  public password:string

  @column({
    serializeAs: null,
   })
  public remember_me_token:string

  @column({
    serializeAs: null,
   })
  public activated:boolean

  @column({
    serializeAs: null,
    })
  public persona_id:number

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true,
    autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Persona, {
    localKey:'id',
    foreignKey:'persona_id'
  })
  public persona: BelongsTo<typeof Persona>
}
