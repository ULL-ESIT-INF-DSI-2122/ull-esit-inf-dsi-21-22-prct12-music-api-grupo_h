import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

/**
 * ArtistDocumentInterface, interfaz para la representación de un artista
 */
interface ArtistDocumentInterface extends Document {
  /**
   * Nombre del artista
   */
  name: string,
  /**
   * Genero/s del artista
   */
  genre: Genre[],
  /**
   * Cancion/es del artista
   */
  song: string[],
  /**
   * Número de oyentes mesuales del artista
   */
  monthlyListeners: number
}

/**
 * Modelo mongoose de un artista
 */
const ArtistSchema = new Schema<ArtistDocumentInterface>({
  /**
   * Nombre del artista
   */
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  /**
   * Genero/s del artista
   */
  genre: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length == 0) {
        throw new Error('An artist must has at least one genre');
      } else if (!value.every((genre) => GenreArray.includes(genre))) {
        throw new Error('Invalid genre');
      }
    },
  },
  /**
   * Cancion/es del artista
   */
  song: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length === 0) {
        throw new Error('An artist must has at least one song');
      }
    },
  },
  /**
   * Número de oyentes mesuales del artista
   */
  monthlyListeners: {
    type: Number,
    required: true,
    trim: true,
    validate: (value: number) => {
      if (!Number.isInteger(value)) {
        throw new Error('Value of monthly listeners must be an integer');
      } else if (value < 0) {
        throw new Error('An artist cant has negative monthly listeners');
      }
    },
  },
});

export const Artist = model<ArtistDocumentInterface>('Artist', ArtistSchema);
