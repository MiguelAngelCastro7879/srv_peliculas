import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import mongoose from 'mongoose';
import { connect } from 'mongoose';
import Pelicula from 'App/Models/Pelicula';
import PeliculaModelo from 'App/Models/PeliculaModel';
import Persona from 'App/Models/Persona';

// 1. Create an interface representing a document in MongoDB.


export default class ComentariosController {


  public async store({request, auth ,response}: HttpContextContract) {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      const existePeli = await Pelicula.find(request.params().id)
      if(existePeli){
        const existeDoc = await PeliculaModelo.PeliculaModel.find({_id:request.params().id})
        if(!existeDoc){
          const doc = new PeliculaModelo.PeliculaModel({_id:request.params().id});
          await doc.save();
        }
      }else{
        return response.badRequest({error: "No existe la pelicula"})
      }
      
      const user = await auth.use('api').authenticate()
      
      const usuario = await Persona.query().whereHas('usuario',(query)=>{
        query.where('id', user.id)
      }).preload('usuario').firstOrFail()

      const nC = {
        comentario:request.input('comentario'),
        usuario:usuario.serializeAttributes()
      }
      const doc = PeliculaModelo.PeliculaModel.updateOne({_id:request.params().id},
      {$push:{comentarios:nC}})

      return doc
    } catch (error) {
      console.log(error)
    }
  }
  
  public async show( id:number) {
    try {
      connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      const existePeli =  Pelicula.find(id)
      if(await existePeli){
        const existeDoc =  PeliculaModelo.PeliculaModel.findOne({_id: id})
        return existeDoc
      }else{
        // return response.badRequest({error: "No existe la pelicula"})
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async index() {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      const docs = PeliculaModelo.PeliculaModel.find()
      return docs
    } catch (error) {
      console.log(error)
    }
  }

  public async destroy({request}: HttpContextContract) {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      // db.peliculas.updateOne({_id:4},{$pull:{comentarios:{_id:ObjectId("6233e8250418c8c14bb18953")}}})

      const doc = PeliculaModelo.PeliculaModel.updateOne({_id:request.params().id},
      {$pull:{
        comentarios:
        {_id: new mongoose.Types.ObjectId(request.input('comentario'))}
      }
      })
      return doc

    } catch (error) {
      console.log(error)
    }
  }
}
