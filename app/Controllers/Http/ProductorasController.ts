import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Productora from 'App/Models/Productora'
import ProductoraValidator from 'App/Validators/ProductoraValidator'

export default class ProductorasController {
  public async index({response}: HttpContextContract) {
    const productoras = await Productora.all()
    return response.ok({
      productoras:productoras
    })
  }

  public async store({request ,response}: HttpContextContract,ctx: HttpContextContract) {
    const validacion = new ProductoraValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const productora = await Productora.create({
        nombre:payload.nombre,
        presidente:payload.presidente,
        propietario:payload.propietario,
        sitio_web:payload.sitio_web,
      })
      return response.ok({
        productora:productora,
        mensaje:'Productora creada correctamente'
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

  public async show({response, request}: HttpContextContract) {
    try {
      const productora = await Productora.findOrFail(request.params().id)
      return response.ok({
        productora:productora
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Productora no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new ProductoraValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      const productora = await Productora.findOrFail(request.params().id)
      productora.nombre=payload.nombre
      productora.presidente=payload.presidente
      productora.propietario=payload.propietario
      productora.sitio_web=payload.sitio_web
      productora.save()
      return response.ok({
        productora:productora,
        mensaje:'Productora actualizada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_VALIDATION_FAILURE':
          return response.badRequest({error: "Ha habido un error de validacion", mensajes:e.messages})
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Productora no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const productora = await Productora.findOrFail(request.params().id)
      productora.delete()
      return response.ok({
        productora:productora,
        mensaje:'Productora eliminada correctamente'
      })
    } catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Productora no encontrada"})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
