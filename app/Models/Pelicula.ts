import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Categoria from './Categoria'
import Clasificacion from './Clasificacion'
import Idioma from './Idioma'
import Productora from './Productora'
import Papel from './Papel'
import PeliculaProductora from './PeliculaProductora'
import PeliculaIdioma from './PeliculaIdioma'

export default class Pelicula extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public imagenes: string

  @column()
  public descripcion: string

  @column()
  public duracion: number

  @column()
  public calificacion: number

  @column({
    serializeAs: null})
  public categoria_id: number

  @column({
    serializeAs: null})
  public clasificacion_id: number

  @column.dateTime({
    serializeAs: null,
    autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: null,
    autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Categoria, {
    localKey: 'id', // id column on "Categoria" model
    foreignKey: 'categoria_id', // userId column on "Pelicula" model
  })
  public categoria: BelongsTo<typeof Categoria>

  @belongsTo(() => Clasificacion, {
    localKey: 'id', // id column on "clasificacion" model
    foreignKey: 'clasificacion_id', // userId column on "Pelicula" model
  })
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


  @hasMany(() => Papel, {
    localKey:'id',
    foreignKey:'pelicula_id'
  })
  public papeles: HasMany<typeof Papel>


  @hasMany(() => PeliculaProductora, {
    localKey:'id',
    foreignKey:'pelicula_id'
  })
  public productoras: HasMany<typeof PeliculaProductora>

  @hasMany(() => PeliculaIdioma, {
    localKey:'id',
    foreignKey:'pelicula_id'
  })
  public idiomas: HasMany<typeof PeliculaIdioma>
}
