import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Categoria from 'App/Models/Categoria';
import CategoriaValidator from 'App/Validators/CategoriaValidator';

export default class CategoriasController {
  public async index({response}: HttpContextContract) {
    const categorias = await Categoria.all()
    response.ok({
      categorias:categorias
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new CategoriaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema});
      const categoria = await Categoria.create(payload)
      response.ok({
        categoria:categoria,
        mensaje:'Categoria creada correctamente'
      })
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async show({response, request}: HttpContextContract) {
    try {
      const categoria = await Categoria.findOrFail(request.params().id)
      response.ok({
        categoria:categoria
      })
    } catch (error) {
      response.notFound({error:'Categoria no encontrada'})
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new CategoriaValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      try {
        const categoria = await Categoria.findOrFail(request.params().id)
        categoria.nombre=payload.nombre
        categoria.save()
        response.ok({
          categoria:categoria,
          mensaje:'Categoria actualizada correctamente'
        })
      } catch (E_ROW_NOT_FOUND) {
        response.notFound({error:'Categoria no encontrada'})
      }
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const categoria = await Categoria.findOrFail(request.params().id)
      categoria.delete()
      response.ok({
        categoria:categoria,
        mensaje:'Categoria eliminada correctamente'
      })
    } catch (E_ROW_NOT_FOUND) {
      response.notFound({error:'Categoria no encontrada'})
    }
  }
}
