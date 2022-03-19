import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import mongoose from 'mongoose';
import { connect } from 'mongoose';
import Pelicula from 'App/Models/Pelicula';
import PeliculaModelo from 'App/Models/PeliculaModel';

// 1. Create an interface representing a document in MongoDB.


export default class ComentariosController {


  public async store({request ,response}: HttpContextContract) {
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
      const doc = PeliculaModelo.PeliculaModel.updateOne({_id:request.params().id},
      {$push:{comentarios:request.input('comentario')}})
      return doc
    } catch (error) {
      console.log(error)
    }
  }

  public async index() {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      const doc = PeliculaModelo.PeliculaModel.find()
      return doc
    } catch (error) {
      console.log(error)
    }
  }

  public async destroy({request}: HttpContextContract) {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      // db.peliculas.updateOne({_id:4},{$pull:{comentarios:{_id:ObjectId("6233e8250418c8c14bb18953")}}})

      const documento_despues = PeliculaModelo.PeliculaModel.updateOne({_id:request.params().id},
      {$pull:{
        comentarios:
        {_id: new mongoose.Types.ObjectId(request.input('comentario'))}
      }
      })
      //  PeliculaModelo.PeliculaModel.find({_id:request.params().id})
      return documento_despues

    } catch (error) {
      console.log(error)
    }
  }
}
