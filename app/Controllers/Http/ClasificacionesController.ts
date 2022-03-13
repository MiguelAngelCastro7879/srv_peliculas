import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Clasificacion from 'App/Models/Clasificacion';
import Pelicula from 'App/Models/Pelicula';
import ClasificacionValidator from 'App/Validators/ClasificacionValidator';

export default class ClasificacionesController {
  public async index({response}: HttpContextContract) {
    const clasificaciones = await Clasificacion.all()
    return response.ok({
      clasificaciones:clasificaciones
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new ClasificacionValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema});
      const clasificacion = await Clasificacion.create(payload)
      return response.ok({
        clasificacion:clasificacion,
        mensaje:'Clasificacion creada correctamente'
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

  public async show({response, request}: HttpContextContract) {
    try {
      const clasificacion = await Clasificacion.findOrFail(request.params().id)
      return response.ok({
        clasificacion:clasificacion
      })
    } catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Clasificacion no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new ClasificacionValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const clasificacion = await Clasificacion.findOrFail(request.params().id)
      clasificacion.nombre=payload.nombre
      clasificacion.descripcion=payload.descripcion
      clasificacion.edad_minima=payload.edad_minima
      clasificacion.save()
      return response.ok({
        clasificacion:clasificacion,
        mensaje:'Clasificacion actualizada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Clasificacion no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const clasificacion = await Clasificacion.findOrFail(request.params().id)
      await Pelicula.query().where('clasificacion_id', clasificacion.id).update({
        clasificacion_id:null
      })
      clasificacion.delete()
      return response.ok({
        clasificacion:clasificacion,
        mensaje:'Clasificacion eliminada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Clasificacion no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
