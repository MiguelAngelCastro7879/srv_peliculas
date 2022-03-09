import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Usuario from './Usuario'
import Actor from './Actor'

export default class Persona extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public nombre: string
  @column()
  public f_nacimiento:string
  @column()
  public nacionalidad:string

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true,
    autoUpdate: true })
  public updatedAt: DateTime


  @hasOne(() => Usuario,{
    localKey:'id',
    foreignKey:'persona_id'
  })
  public usuario: HasOne<typeof Usuario>

  @hasOne(() => Actor,{
    localKey:'id',
    foreignKey:'persona_id'
  })
  public actor: HasOne<typeof Actor>
}
