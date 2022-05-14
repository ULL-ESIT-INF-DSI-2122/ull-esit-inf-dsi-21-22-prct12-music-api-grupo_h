import {Document, Schema, model} from 'mongoose';
import {Genre} from '../genre/genre';

interface SongDocumentInterface extends Document {
  title: string,
  author: string,
  duration: number,
  genre: Genre,
  single: boolean,
  reproductions: number
}

const SongSchema = new Schema<SongDocumentInterface>({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El título de la canción debe de empezar por mayúscula');
      }
    },
  },
  author: {
    type: String,
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
  single: {
    type: Boolean,
    required: true,
    trim: true,
  },
  reproductions: {
    type: Number,
    required: true,
    trim: true,
  },
});

export const Song = model<SongDocumentInterface>('Song', SongSchema);
