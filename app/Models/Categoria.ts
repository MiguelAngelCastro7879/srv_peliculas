import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Categoria extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
