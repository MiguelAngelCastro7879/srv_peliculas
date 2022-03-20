import { Schema, model} from 'mongoose';

interface InPelicula {
    _id: number;
    comentarios: Array<Object>
    ;
}

export default class PeliculaModelo {
    static peliSchema = new Schema<InPelicula>({
    _id: { type: Number, required: true },
    comentarios: [{usuario:Object,comentario:String}],
  });
  static PeliculaModel: any = model<InPelicula>('pelicula', this.peliSchema);
}
