import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Idioma from 'App/Models/Idioma';
import PeliculaIdioma from 'App/Models/PeliculaIdioma';
import IdiomaValidator from 'App/Validators/IdiomaValidator';

export default class IdiomasController {
  public async index({response}: HttpContextContract) {
    const idiomas = await Idioma.all()
    return response.ok({
      idiomas:idiomas
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new IdiomaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema});
      const idioma = await Idioma.create(payload)
      return response.ok({
        idioma:idioma,
        mensaje:'Idioma creado correctamente'
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
      const idioma = await Idioma.findOrFail(request.params().id)
      return response.ok({
        idioma:idioma
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Idioma no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new IdiomaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const idioma = await Idioma.findOrFail(request.params().id)
      idioma.nombre=payload.nombre
      idioma.save()
      return response.ok({
        idioma:idioma,
        mensaje:'Idioma actualizado correctamente'
      })
    } catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Idioma no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const idioma = await Idioma.findOrFail(request.params().id)
      await PeliculaIdioma.query().has('pelicula').delete().where('idioma_id', idioma.id)
      idioma.delete()
      return response.ok({
        idioma:idioma,
        mensaje:'Idioma eliminado correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Idioma no encontrado"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
