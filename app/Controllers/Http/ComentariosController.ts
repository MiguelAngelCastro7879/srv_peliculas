import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Schema, model, connect } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Comentario {
  usuario_id: number;
  comentario: string;
}
interface InPelicula {
  _id: number;
  comentarios: Array<Object>;
}

export default class ComentariosController {


  public async store({request ,response}: HttpContextContract) {
    await connect('mongodb+srv://mike:platinum@sandbox.tbdy0.mongodb.net/cine?retryWrites=true&w=majority');
    const peliSchema = new Schema<InPelicula>({
      _id: { type: Number, required: true },
      comentarios: [{usuario_id:Number,comentario:String}],
    });
    const PeliculaModel = model<InPelicula>('pelicula', peliSchema);
    const peli = PeliculaModel.find({_id:request.params().id})
    peli.updateOne({
      comentarios:{'$push': {
        usuario_id:request.input('usuario'),
        comentario:request.input('comentario')}}})
    console.log(peli)
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
