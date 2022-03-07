import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
