import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Categoria from './Categoria'
import Clasificacion from './Clasificacion'
import Idioma from './Idioma'
import Productora from './Productora'

export default class Pelicula extends BaseModel {
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

  @belongsTo(() => Categoria)
  public categoria: BelongsTo<typeof Categoria>

  @belongsTo(() => Clasificacion)
  public clasificacion: BelongsTo<typeof Clasificacion>

  @manyToMany(() => Idioma, {
    pivotTable: 'peliculas_idiomas',
    pivotRelatedForeignKey: 'idioma_id',// idioma_id column on "peliculas_idiomas" model
    pivotForeignKey: 'pelicula_id',// pelicula_id column on "Pelicula" model
    relatedKey: 'id', // id column on "Idioma" model
    localKey: 'id', // id column on "Pelicula" model

  })
  public idioma: ManyToMany<typeof Idioma>

  @manyToMany(() => Productora, {
    pivotTable: 'peliculas_productoras',
    pivotRelatedForeignKey: 'productora_id',// Productora_id column on "peliculas_Productora" model
    pivotForeignKey: 'pelicula_id',// pelicula_id column on "Pelicula" model
    relatedKey: 'id', // id column on "Productora" model
    localKey: 'id', // id column on "Pelicula" model
  })
  public productora: ManyToMany<typeof Productora>
}
