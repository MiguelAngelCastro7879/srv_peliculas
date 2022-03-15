import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Papel from 'App/Models/Papel';
import Pelicula from 'App/Models/Pelicula';
import PapelValidator from 'App/Validators/PapelValidator';
import PeliculaValidator from 'App/Validators/PeliculaValidator';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import PeliculaIdioma from 'App/Models/PeliculaIdioma';
import PeliculaProductora from 'App/Models/PeliculaProductora';

export default class PeliculasController {
  public async index({response}: HttpContextContract) {
    const peliculas = await Pelicula.query().
    has('categoria').has('clasificacion').
    preload('categoria').preload('clasificacion').
    preload('papeles',(query)=>{
      query.preload('actor',(subquery)=>{
        subquery.preload('persona')
      })
    }).preload('idioma').preload('productora')
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
      preload('categoria').preload('clasificacion').
      preload('idioma').preload('productora').where('id', p.id)
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
      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id',request.params().id).firstOrFail()
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
      const p = await Pelicula.findOrFail(request.params().id)

      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id', p.id)

      await Papel.query().has('pelicula').delete().where('pelicula_id', p.id)
      await PeliculaProductora.query().has('pelicula').delete().where('pelicula_id', p.id)
      await PeliculaIdioma.query().has('pelicula').delete().where('pelicula_id', p.id)

      p.delete()
      return response.ok({
        pelicula:pelicula,
        mensaje:'Pelicula eliminada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Pelicula no encontrada"})
        default:
          console.log(e)
          return response.badRequest({error: e.code })
      }
    }
  }


  public async agregarPapel({response , request}: HttpContextContract, ctx: HttpContextContract) {
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
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id', p.id)

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

  public async agregarProductora({response , request}: HttpContextContract) {

    const validacion =  schema.create({
      productora_id: schema.number([
        rules.exists({ table: 'productoras', column: 'id' })
      ]),
    })

    try {
      const payload = await request.validate({schema: validacion,})
      const p = await Pelicula.findOrFail(request.params().id)
      await PeliculaProductora.create({
        productora_id:payload.productora_id,
        pelicula_id:p.id
      })
      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id', p.id)

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

  public async agregarIdioma({response , request}: HttpContextContract) {

    const validacion =  schema.create({
      idioma_id: schema.number([
        rules.exists({ table: 'idiomas', column: 'id' })
      ]),
    })

    try {
      const payload = await request.validate({schema: validacion,});
      const p = await Pelicula.findOrFail(request.params().id)
      await PeliculaIdioma.create({
        idioma_id:payload.idioma_id,
        pelicula_id:p.id
      })

      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id', p.id)

      return response.ok({
        pelicula:pelicula,
        mensaje:'Idioma agregado correctamente'
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


  public async eliminarPapel({response ,params}: HttpContextContract) {
    try {
      const papel = await Papel.findOrFail(params.id)
      const id = papel.pelicula_id
      papel.delete()

      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id',id)

      return response.ok({
        pelicula:pelicula,
        mensaje:'Papel eliminado correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Papel no encontrado", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async eliminarProductora({response ,params}: HttpContextContract) {
    try {
      const productora = await PeliculaProductora.findOrFail(params.id)
      const id = productora.pelicula_id
      productora.delete()

      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id',id)

      return response.ok({
        pelicula:pelicula,
        mensaje:'Productora eliminada correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Productora no encontrada", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }

  public async eliminarIdioma({response ,params}: HttpContextContract) {
    try {
      const idioma = await PeliculaIdioma.findOrFail(params.id)
      const id = idioma.pelicula_id
      idioma.delete()

      const pelicula = await Pelicula.query().
      preload('categoria').preload('clasificacion').
      preload('papeles',(query)=>{
        query.preload('actor',(subquery)=>{
          subquery.preload('persona')
        })
      }).preload('idioma').preload('productora').where('id',id)

      return response.ok({
        pelicula:pelicula,
        mensaje:'Idioma eliminado correctamente'
      })
    }catch (e) {
      switch(e.code){
        case 'E_ROW_NOT_FOUND':
          return response.badRequest({error: "Idioma no encontrado", mensajes:e.messages})
        default:
          return response.badRequest({error: e.code })
      }
    }
  }
}
