import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Actor from 'App/Models/Actor'
import Persona from 'App/Models/Persona'
import ActorValidator from 'App/Validators/ActorValidator'

export default class ActoresController {
  public async index({response}: HttpContextContract) {
    const personas = await Persona.query().has('actor').preload('actor')
    return response.ok({
      'actores':personas
    })
  }

  public async store({request, response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new ActorValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      const persona = await Persona.create({
        nombre: payload.nombre,
        f_nacimiento: payload.f_nacimiento.toSQL(),
        nacionalidad: payload.nacionalidad
      })
      const actor = await Actor.create({
        persona_id:persona.id,
        inicio_carrera:payload.inicio_carrera.toSQL(),
      })
      if(payload.final_carrera != null)
        actor.final_carrera=payload.final_carrera!.toSQL(),
        actor.save()
      return response.ok({
        actor:{
          'nombre':persona.nombre,
          'f_nacimiento':persona.f_nacimiento,
          'nacionalidad':persona.nacionalidad,
          'inicio_carrera':actor.inicio_carrera,
          'final_carrera':actor.final_carrera,
        },
        mensaje:'Actor creado correctamente'
      })
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
      const persona = await Persona.query().whereHas('actor',(query)=>{
        query.where('id', params.id)
      }).preload('actor').firstOrFail()
      return response.ok({
        actor:persona
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
          case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Actor no encontrado", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({request, response}: HttpContextContract, ctx:HttpContextContract) {
    const validacion = new ActorValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.newSchema,});
      const persona1 = await Persona.query().whereHas('actor',(query)=>{
        query.where('id', request.params().id)
      }).preload('actor').firstOrFail()
      persona1.actor.inicio_carrera = payload.inicio_carrera.toSQL()
      persona1.nombre = payload.nombre
      persona1.f_nacimiento = payload.f_nacimiento.toSQL()
      persona1.nacionalidad= payload.nacionalidad
      if(payload.final_carrera != null)
        persona1.actor.final_carrera=payload.final_carrera!.toSQL()
      persona1.actor.save()
      persona1.save()
      return response.ok({
        actor:persona1,
        mensaje:'Actor actualizado correctamente'
      })
    } catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Actor no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try{
      const actor = await (await Actor.findOrFail(request.params().id)).delete()
      return response.ok({
        actor:actor,
        mensaje:'Actor eliminado'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Actor no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
