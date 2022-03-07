import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Idioma from 'App/Models/Idioma';
import IdiomaValidator from 'App/Validators/IdiomaValidator';

export default class IdiomasController {
  public async index({response}: HttpContextContract) {
    const idiomas = await Idioma.all()
    response.ok({
      idiomas:idiomas
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new IdiomaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema});
      const idioma = await Idioma.create(payload)
      response.ok({
        idioma:idioma,
        mensaje:'Idioma creado correctamente'
      })
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async show({response, request}: HttpContextContract) {
    try {
      const idioma = await Idioma.findOrFail(request.params().id)
      response.ok({
        idioma:idioma
      })
    } catch (error) {
      response.notFound({error:'idioma no encontrada'})
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new IdiomaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      try {
        const idioma = await Idioma.findOrFail(request.params().id)
        idioma.nombre=payload.nombre
        idioma.save()
        response.ok({
          idioma:idioma,
          mensaje:'Idioma actualizado correctamente'
        })
      } catch (E_ROW_NOT_FOUND) {
        response.notFound({error:'idioma no encontrado'})
      }
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const idioma = await Idioma.findOrFail(request.params().id)
      idioma.delete()
      response.ok({
        idioma:idioma,
        mensaje:'Idioma eliminado correctamente'
      })
    } catch (E_ROW_NOT_FOUND) {
      response.notFound({error:'Idioma no encontrado'})
    }
  }
}
