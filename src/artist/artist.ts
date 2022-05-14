import {Document, Schema, model} from 'mongoose';
import {Genre} from '../genre/genre';

interface ArtistDocumentInterface extends Document {
  name: string,
  genre: Genre,
  songs: string[],
  listeners: number
}

const ArtistSchema = new Schema<ArtistDocumentInterface>({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    trim: true,
  },
  genre: {
    type: [String],
    required: true,
    trim: true,
    enum: ['Rock', 'Heavy Metal', 'Reggaeton', 'Jazz', 'Pop', 'Rap',
      'Hip-hop', 'Trap', 'Urban', 'Latino', 'Bachata', 'Music alternative', 'Electro'],
  },
  song: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length === 0) {
        throw new Error('El artista no tiene canciones');
      } else {
        value.forEach((song) => {
          if (!song.match(/^[A-Z]/)) {
            throw new Error('El nombre de la canción debe empezar con mayúscula');
          }
        });
      }
    },
  },
  reproductions: {
    type: Number,
    required: true,
    trim: true,
  },
});

export const Artist: model<ArtistDocumentInterface> = model<ArtistDocumentInterface>('Artist', ArtistSchema);
