import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import mongoose from 'mongoose';
import { Schema, model, connect } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.

interface InPelicula {
  _id: number;
  comentarios: Array<Object>
  ;
}

const peliSchema = new Schema<InPelicula>({
  _id: { type: Number, required: true },
  comentarios: [{usuario_id:Number,comentario:String}],
});
const PeliculaModel = model<InPelicula>('pelicula', peliSchema);

export default class ComentariosController {


  public async store({request ,response}: HttpContextContract) {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      const doc = PeliculaModel.updateOne({_id:request.params().id},
      {$push:{comentarios:request.input('comentario')}})
      return doc
    } catch (error) {
      console.log(error)
    }
  }

  public async index({response}: HttpContextContract) {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      const doc = PeliculaModel.find()
      return doc
    } catch (error) {
      console.log(error)
    }
  }

  public async destroy({request,response}: HttpContextContract) {
    try {
      await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
      // db.peliculas.updateOne({_id:4},{$pull:{comentarios:{_id:ObjectId("6233e8250418c8c14bb18953")}}})
      const documento_antes = PeliculaModel.find({_id:request.params().id})

      PeliculaModel.updateOne({_id:request.params().id},{comentarios:{_id: new mongoose.Types.ObjectId(request.input('comentario'))}})
      const documento_despues = PeliculaModel.find({_id:request.params().id})
      response.ok({
        documento_antes:documento_antes,
        documento_despues:documento_despues,
        mensaje:'Comentario Eliminado Correctamente'
      });
    } catch (error) {
      console.log(error)
    }
  }

  public async run(): Promise<void> {
    // 4. Connect to MongoDB

    // const doc = new this.UserModel({
    //   name: 'Bill',
    //   email: 'bill@initech.com',
    //   avatar: 'https://i.imgur.com/dM7Thhn.png'
    // });
    // await doc.save();

    // console.log(doc.email); // 'bill@initech.com'
  }
}
