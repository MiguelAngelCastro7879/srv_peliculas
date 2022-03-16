import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PeliculaValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  // public schema = schema.create({
  //   nombre: schema.string({trim:true}),
  //   descripcion: schema.string({trim:true}),
  //   duracion: schema.number(),
  //   calificacion: schema.number([
  //     rules.range(0,101),
  //   ]),
  //   categoria_id: schema.number(),
  //   clasificacion_id: schema.number(),
  // })
public schema = schema.create({
    nombre: schema.string({trim:true}),
    descripcion: schema.string({trim:true}),
    duracion: schema.number(),
    calificacion: schema.number([
      rules.range(0,101),
    ]),
    categoria_id: schema.number([
      rules.exists({ table: 'categorias', column: 'id' })
    ]),
    clasificacion_id: schema.number([
      rules.exists({ table: 'clasificaciones', column: 'id' })
    ]),
  })
  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
