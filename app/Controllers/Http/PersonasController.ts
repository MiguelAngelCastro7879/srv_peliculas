import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Persona from 'App/Models/Persona'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class PersonasController {
  public async index({response}: HttpContextContract) {
    const personas = await Persona.all()
    response.header('Content-type', 'application/json')
    response.status(200).send({
      'personas':personas
    })
  }

  public async store({request, response}: HttpContextContract) {
    const newSchema = schema.create({
      nombre: schema.string({trim:true}),

      f_nacimiento: schema.date({
        format: 'sql',
      }),

      nacionalidad: schema.string({}),
    });

    try {
      const payload = await request.validate({schema: newSchema,});
      const p = await Persona.create({
        nombre: payload.nombre,
        f_nacimiento: payload.f_nacimiento.toSQLDate(),
        nacionalidad: payload.nacionalidad
      });
      response.status(201)
      response.send({
        'persona':p,
        'mensaje':'Persona creada correctamente'
      })
    } catch (payload) {
      response.badRequest(payload.messages)
    }
  }

  public async show({params, response}: HttpContextContract) {
    try{
      const persona = await Persona.findOrFail(params.id)
      response.status(200)
      response.send({
        'persona':persona
      })
    }catch(persona){
      response.status(404)
      response.send({
        'mensaje':'Persona no encontrada'
      })
    }
  }

  public async update({request, response}: HttpContextContract) {
    const newSchema = schema.create({
      nombre: schema.string({trim:true}),

      f_nacimiento: schema.date({
        format: 'sql',
      }),

      nacionalidad: schema.string({}),
    });
    try {
      const payload = await request.validate({schema: newSchema,});
      try{
        const persona = await Persona.findOrFail(request.params().id)
        persona.nombre = payload.nombre
        persona.f_nacimiento = payload.f_nacimiento.toSQL()
        persona.nacionalidad = payload.nacionalidad
        persona.save()
        response.status(200)
        response.send({
          'mensaje':'Persona Actualizada',
          'persona':persona
        })
      }catch(E_ROW_NOT_FOUND){
        response.status(404)
        response.send({
          'mensaje':'Persona no encontrada'
        })
      }
    }catch(error){
      response.badRequest(error.messages)
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    try {
      const persona = await Persona.findOrFail(params.id)
      const usr_tmp = persona
      persona.delete()
      response.status(200)
      response.send({
        'mensaje':'Persona Eliminada',
        'persona':usr_tmp
      })
    } catch (E_ROW_NOT_FOUND) {
      response.status(404)
      response.send({
        'mensaje':'Persona no encontrada'
      })
    }
  }
}
