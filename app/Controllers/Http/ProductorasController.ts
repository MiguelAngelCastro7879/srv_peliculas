import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Productora from 'App/Models/Productora'
import ProductoraValidator from 'App/Validators/ProductoraValidator'

export default class ProductorasController {
  public async index({response}: HttpContextContract) {
    const productoras = await Productora.all()
    response.ok({
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
      response.ok({
        productora:productora,
        mensaje:'Productora creada correctamente'
      })
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async show({response, request}: HttpContextContract) {
    try {
      const productora = await Productora.findOrFail(request.params().id)
      response.ok({
        productora:productora
      })
    } catch (error) {
      response.notFound({error:'Productora no encontrada'})
    }
  }

  public async update({response , request}: HttpContextContract, ctx: HttpContextContract) {
    const validacion = new ProductoraValidator(ctx)
    try {
      const payload = await request.validate({schema: validacion.schema,});
      try {
        const productora = await Productora.findOrFail(request.params().id)
        productora.nombre=payload.nombre
        productora.presidente=payload.presidente
        productora.propietario=payload.propietario
        productora.sitio_web=payload.sitio_web
        productora.save()
        response.ok({
          productora:productora,
          mensaje:'Productora actualizada correctamente'
        })
      } catch (E_ROW_NOT_FOUND) {
        response.notFound({error:'Productora no encontrada'})
      }
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async destroy({request, response}: HttpContextContract) {
    try {
      const productora = await Productora.findOrFail(request.params().id)
      productora.delete()
      response.ok({
        productora:productora,
        mensaje:'Productora eliminada correctamente'
      })
    } catch (E_ROW_NOT_FOUND) {
      response.notFound({error:'Productora no encontrada'})
    }
  }
}
