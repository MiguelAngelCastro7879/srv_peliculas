import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Persona from 'App/Models/Persona';
import Usuario from 'App/Models/Usuario';
import Hash from '@ioc:Adonis/Core/Hash'
import UsuarioValidator from 'App/Validators/UsuarioValidator';
import Database from '@ioc:Adonis/Lucid/Database';

export default class UsuariosController {
  public async index({response}: HttpContextContract) {
    const personas = await Persona.query().whereHas('usuario',(query)=>{
      query.where('activated', true)
    }).preload('usuario')
    return response.ok({
      'usuarios':personas
    })
  }

  public async store({request, response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new UsuarioValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      const u = await Usuario.findBy('email',payload.email)
      if(u == null){
        const persona = await Persona.create({
          nombre: payload.nombre,
          //f_nacimiento: payload.f_nacimiento.toString(),
          f_nacimiento: payload.f_nacimiento.toSQLDate(),
          nacionalidad: payload.nacionalidad
        })
        const user = await Usuario.create({
          username:payload.username,
          email:payload.email,
          activated:true,
          rol:payload.rol,
          password:await Hash.make(payload.password),
          persona_id:persona.id
        })

        const usuario = await Persona.query().whereHas('usuario',(query)=>{
          query.where('id', user.id)
        }).preload('usuario').firstOrFail()

        return response.ok({
          usuario:usuario,
          mensaje:'Usuario creado correctamente'
        })
      }else{
        response.badRequest({error: "El correo electronico ya está en uso"})
      }
    } catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        default:
          console.log(e)
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
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Usuario no encontrado"})
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
      persona1.usuario.rol = payload.rol
      persona1.nombre = payload.nombre
      persona1.f_nacimiento = payload.f_nacimiento.toSQLDate()
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

  public async login({auth, request, response}: HttpContextContract, ) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      const user = await Usuario.findByOrFail('email', email)

      await Database.from('api_tokens').where('user_id', user.id).delete()
      if(user.activated == true){
        if (!(await Hash.verify(user.password, password))) {
          return response.badRequest({error: 'Invalid credentials'})
        }
        const token = await auth.use('api').attempt(email, password)
        response.header('Authorization', 'Bearer '+token)
        return response.ok({
          token: token,
          usuario:user,
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
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Usuario no encontrado"})
        default:
          console.log(e)
          return response.badRequest({error: e.code })
      }
    }
  }

  public async logout({auth, response}: HttpContextContract){
    try{
      const usuario = await auth.use('api').authenticate()
      await auth.use('api').revoke()
      return response.ok({
        usuario:usuario,
        mensaje:'Sesion terminada'
      })
    }catch(e){
      switch(e.code){
        case 'E_INVALID_AUTH_SESSIO':
          return response.badRequest({error: 'Token Invalido'})
        default:
          console.log(e)
          return response.badRequest({error: e.code })
      }
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
  public async verificarToken({auth, response}: HttpContextContract){
    try{
      return await auth.use('api').authenticate()
    }catch(E_INVALID_AUTH_SESSIO){
      return response.badRequest({error: 'Token Invalido'})
    }
  }
}
