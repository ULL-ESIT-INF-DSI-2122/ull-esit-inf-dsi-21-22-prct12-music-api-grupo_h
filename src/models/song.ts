import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

/**
 * SongDocumentInterface, interfaz para la representación de una canción
 */
interface SongDocumentInterface extends Document {
  /**
   * Título de la cancion
   */
  title: string,
  /**
   * Autor de la cancion
   */
  author: string,
  /**
   * Duracion (en segundos) de la cancion
   */
  duration: number,
  /**
   * Genero/s de la cancion
   */
  genre: Genre[],
  /**
   * Determina si la cancion es un single
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
   * Duracion (en segundos) de la cancion
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
   * Genero/s de la cancion
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
   * Determina si la cancion es un single
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
