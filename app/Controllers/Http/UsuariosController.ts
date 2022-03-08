import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Persona from 'App/Models/Persona';
import Usuario from 'App/Models/Usuario';
import Hash from '@ioc:Adonis/Core/Hash'
import UsuarioValidator from 'App/Validators/UsuarioValidator';

export default class UsuariosController {
  public async index({response}: HttpContextContract) {
    const personas = await Persona.query().whereHas('usuario',(query)=>{
      query.where('activated', true)
    }).preload('usuario')
    return response.ok({
      'users':personas
    })
  }

  public async store({request, response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new UsuarioValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      const persona = await Persona.create({
        nombre: payload.nombre,
        f_nacimiento: payload.f_nacimiento.toSQL(),
        nacionalidad: payload.nacionalidad
      })
      const user = await Usuario.create({
        username:payload.username,
        email:payload.email,
        activated:true,
        password:await Hash.make(payload.password),
        persona_id:persona.id
      })
      return response.ok({
        usuario:{
          'nombre':persona.nombre,
          'f_nacimiento':persona.f_nacimiento,
          'nacionalidad':persona.nacionalidad,
          'username':user.username,
          'email':user.email,
        },
        mensaje:'Usuario creado correctamente'
      })
    } catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async show({response, params}: HttpContextContract) {
    try{
      const persona = await Persona.query().whereHas('usuario',(query)=>{
        query.where('id', params.id)
      }).preload('usuario').firstOrFail()
      return response.ok({
        usuario:persona
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({request, response}: HttpContextContract, ctx:HttpContextContract) {
    const validacion = new UsuarioValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      const persona1 = await Persona.query().whereHas('usuario',(query)=>{
        query.where('id', request.params().id)
      }).preload('usuario').firstOrFail()
      persona1.usuario.email = payload.email
      persona1.usuario.username = payload.username
      persona1.usuario.password = payload.password
      persona1.nombre = payload.nombre
      persona1.f_nacimiento = payload.f_nacimiento.toSQL()
      persona1.nacionalidad= payload.nacionalidad
      persona1.usuario.save()
      persona1.save()
      return response.ok({
        usuario:persona1,
        mensaje:'Usuario actualizado correctamente'
      })
    } catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Usuario no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try{
      const usuario = await (await Usuario.findOrFail(request.params().id)).delete()
      return response.ok({
        usuario:usuario,
        mensaje:'Usuario eliminado'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Usuario no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async login({auth, request, response}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      const user = await Usuario.findByOrFail('email', email)
      if(user.activated == true){
        await auth.use('web').attempt(email, password)
        return response.ok({
          mensaje:'sesion iniciada'
        })
      }
      else{
        return response.notFound({error:'Usuario no encontrado'})
      }
    } catch (e) {
      switch(e.code){
        case 'E_INVALID_AUTH_PASSWORD':
          return response.badRequest({error:'Contraseña invalida'})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async logout({auth, response}: HttpContextContract){
    try{
      await auth.use('web').authenticate()
      await auth.use('web').logout()
      return response.ok({
        mensaje:'Sesion terminada'
      })
    }catch(E_INVALID_AUTH_SESSIO){
      return response.badRequest({error: 'No hay sesiones activas'})
    }
  }

  public async statusCuenta({request, response}: HttpContextContract){
    try {
      const user = await Usuario.findByOrFail('email',request.input('email'))
      user.activated = !user.activated
      user.save()
      if(user.activated){
        return response.ok({mensaje:'Cuenta activada'})
      }
      else{
        return response.ok({mensaje:'Cuenta desactivada'})
      }
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Usuario no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
