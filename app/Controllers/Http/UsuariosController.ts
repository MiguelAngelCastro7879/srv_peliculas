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
    response.ok({
      'users':personas
    })
  }

  public async store({request, response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new UsuarioValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      const correoExist = await Usuario.findByOrFail('email',payload.email)
      try{
        response.conflict({
          error:'Ya existe un usario con este correo electronico'
        })
      }catch{
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
        response.ok({
          usuario:{
            'nombre':persona.nombre,
            'username':user.username,
            'email':user.email,
            'f_nacimiento':persona.f_nacimiento,
            'nacionalidad':persona.nacionalidad
          },
          mensaje:'Usuario creado correctamente'
        })
      }
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async show({response, params}: HttpContextContract) {
    try{
      const persona = await Persona.query().whereHas('usuario',(query)=>{
        query.where('id', params.id)
      }).preload('usuario').firstOrFail()
      response.ok({
        usuario:persona
      })
    }catch(user){
      response.notFound({error:'Usuario no encontrado'})
    }
  }

  public async update({request, response}: HttpContextContract, ctx:HttpContextContract) {
    const validacion = new UsuarioValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      try {
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
        response.ok({
          usuario:persona1,
          mensaje:'Usuario actualizado correctamente'
        })
      } catch (E_ROW_NOT_FOUND) {
        response.notFound({error:'Usuario no encontrado'})
      }
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try{
      const usuario = await (await Usuario.findOrFail(request.params().id)).delete()
      response.ok({
        usuario:usuario,
        mensaje:'Usuario eliminado'
      })
    }catch(E_ROW_NOT_FOUND){
      response.notFound({error:'Usuario no encontrado'})
    }
  }

  public async login({auth, request, response}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      const user = await Usuario.findByOrFail('email', email)
      if(user.activated == true){
        try {
          await auth.use('web').attempt(email, password)
          response.ok({
            mensaje:'sesion iniciada'
          })
        } catch (E_INVALID_AUTH_PASSWORD) {
          response.badRequest({error:'Contraseña invalida'})
        }
      }
      else{
        response.notFound({error:'Usuario no encontrado'})
      }
    } catch (E_ROW_NOT_FOUND) {
      response.notFound({error:'Usuario no encontrado'})
    }
  }

  public async logout({auth, response}: HttpContextContract){
    try{
      await auth.use('web').authenticate()
      await auth.use('web').logout()
      response.ok({
        mensaje:'Sesion terminada'
      })
    }catch(E_INVALID_AUTH_SESSIO){
      response.badRequest({error: 'No hay sesiones activas'})
    }
  }

  public async statusCuenta({request, response}: HttpContextContract){
    try {
      const user = await Usuario.findByOrFail('email',request.input('email'))
      user.activated = !user.activated
      user.save()
      if(user.activated){
        response.ok({mensaje:'Cuenta activada'})
      }
      else{
        response.ok({mensaje:'Cuenta desactivada'})
      }
    } catch (E_ROW_NOT_FOUND) {
        response.notFound({error:'Usuario no encontrado'})
    }
  }
}
