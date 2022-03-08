import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Categoria from 'App/Models/Categoria';
import CategoriaValidator from 'App/Validators/CategoriaValidator';

export default class CategoriasController {
  public async index({response}: HttpContextContract) {
    const categorias = await Categoria.all()
    return response.ok({
      categorias:categorias
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new CategoriaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema});
      const categoria = await Categoria.create(payload)
      return response.ok({
        categoria:categoria,
        mensaje:'Categoria creada correctamente'
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
      const categoria = await Categoria.findOrFail(request.params().id)
      return response.ok({
        categoria:categoria
      })
    } catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Categoria no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new CategoriaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const categoria = await Categoria.findOrFail(request.params().id)
      categoria.nombre=payload.nombre
      categoria.save()
      return response.ok({
        categoria:categoria,
        mensaje:'Categoria actualizada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Categoria no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const categoria = await Categoria.findOrFail(request.params().id)
      categoria.delete()
      return response.ok({
        categoria:categoria,
        mensaje:'Categoria eliminada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Categoria no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
