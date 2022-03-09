import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Papel from 'App/Models/Papel';
import Pelicula from 'App/Models/Pelicula';
import PapelValidator from 'App/Validators/PapelValidator';
import PeliculaValidator from 'App/Validators/PeliculaValidator';

export default class PeliculasController {
  public async index({response}: HttpContextContract) {
    const peliculas = await Pelicula.query().
    has('categoria').preload('categoria').
    has('clasificacion').preload('clasificacion').
    preload('papeles',(query)=>{
      query.preload('actor',(subquery)=>{
        subquery.preload('persona')
      })
    })
    return response.ok({
      peliculas:peliculas
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new PeliculaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema});
      const p = await Pelicula.create(payload)

      const pelicula = await Pelicula.query().
      has('categoria').preload('categoria').
      has('clasificacion').preload('clasificacion').where('id', p.id)
      return response.ok({
        pelicula:pelicula,
        mensaje:'Pelicula creada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Hubo un error procesando la categoria/clasificacion"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async show({response, request}: HttpContextContract) {
    try {
      const pelicula = await Pelicula.findOrFail(request.params().id)
      return response.ok({
        pelicula:pelicula
      })
    } catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Pelicula no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new PeliculaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const pelicula = await Pelicula.findOrFail(request.params().id)
      pelicula.nombre = payload.nombre
      pelicula.descripcion = payload.descripcion
      pelicula.duracion = payload.duracion
      pelicula.calificacion = payload.calificacion
      pelicula.categoria_id = payload.categoria_id
      pelicula.clasificacion_id = payload.clasificacion_id
      pelicula.save()
      return response.ok({
        pelicula:pelicula,
        mensaje:'Clasificacion actualizada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Pelicula no encontrada", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const pelicula = await Pelicula.findOrFail(request.params().id)
      pelicula.delete()
      return response.ok({
        pelicula:pelicula,
        mensaje:'Pelicula eliminada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Pelicula no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }


  public async agregarActor({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new PapelValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const p = await Pelicula.findOrFail(request.params().id)
      await Papel.create({
        actor_id:payload.actor_id,
        papel:payload.papel,
        pelicula_id:p.id
      })
      const pelicula = await Pelicula.query().
      has('categoria').preload('categoria').
      has('clasificacion').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).where('id', p.id)

      return response.ok({
        pelicula:pelicula,
        mensaje:'Clasificacion actualizada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Pelicula no encontrada", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
