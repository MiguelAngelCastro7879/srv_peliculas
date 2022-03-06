import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Persona from 'App/Models/Persona';
import Usuario from 'App/Models/Usuario';
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsuariosController {
  public async index({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const newSchema = schema.create({
      nombre: schema.string({trim:true}),
      f_nacimiento: schema.date({
        format: 'sql',
      }),
      nacionalidad: schema.string({}),
      username: schema.string({}),
      email: schema.string({}, [
        rules.email({
          sanitize: true,
          ignoreMaxLength: true,
          domainSpecificValidation: true,
        })
      ]),
      activated: schema.boolean(),
      password: schema.string({}, [
        rules.confirmed('password_confirmation')
      ]),
    });
    try {
      const payload = await request.validate({schema: newSchema,});
      const persona = await Persona.create({
        nombre: payload.nombre,
        f_nacimiento: payload.f_nacimiento.toSQL(),
        nacionalidad: payload.nacionalidad
      })
      const user = await Usuario.create({
        username:payload.username,
        email:payload.email,
        activated:payload.activated,
        password:await Hash.make(payload.password),
        persona_id:persona.id
      })
      response.status(201)
      response.send({
        'Usuario':{
          'nombre':persona.nombre,
          'username':user.username,
          'email':user.email
        },
        'mensaje':'Usuario creado correctamente'
      })
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async login({auth, request, response}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await Usuario
    .query()
    .where('email', email)
    .firstOrFail()

    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }
    await auth.use('web').login(user)
    response.redirect('/dashboard')
  }

  public async logout({auth, response}: HttpContextContract){
    await auth.use('web').logout()
    response.redirect('/inicia_sesion')
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
