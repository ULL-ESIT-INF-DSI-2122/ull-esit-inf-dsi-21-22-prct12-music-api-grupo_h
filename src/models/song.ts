import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

/**
 * SongDocumentInterface, esquema de cancion
 */
interface SongDocumentInterface extends Document {
  /**
   * Nombre de la cancion
   */
  title: string,
  /**
   * Autor de la cancion
   */
  author: string,
  /**
   * Duracion de la cancion
   */
  duration: number,
  /**
   * Genero de la cancion
   */
  genre: Genre[],
  /**
   * Comprobar si la cancion es un single
   */
  single: boolean,
  /**
   * Numero de reproducciones de la cancion
   */
  reproductions: number
}


const SongSchema = new Schema<SongDocumentInterface>({
  /**
   * Nombre de la cancion
   */
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  /**
   * Autor de la cancion
   */
  author: {
    type: String,
    required: true,
    trim: true,
  },
  /**
   * Duracion de la cancion
   */
  duration: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('A song duration must be greater than zero');
      }
    },
  },
  /**
   * Genero de la cancion
   */
  genre: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length == 0) {
        throw new Error('A song must has at least one genre');
      } else if (!value.every((genre) => GenreArray.includes(genre))) {
        throw new Error('Invalid song genre');
      }
    },
  },
  /**
   * Comprobar si la cancion es un single
   */
  single: {
    type: Boolean,
    required: true,
  },
  /**
   * Numero de reproducciones de la cancion
   */
  reproductions: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (!Number.isInteger(value)) {
        throw new Error('Value of song reproductions must be an integer');
      } else if (value <= 0) {
        throw new Error('Value of song reproductions must be greater than zero');
      }
    },
  },
});

export const Song = model<SongDocumentInterface>('Song', SongSchema);
