import validator from 'validator';
import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

/**
 * PlaylistDocumentInterface, interfaz para la representación de una playlist
 */
interface PlaylistDocumentInterface extends Document {
  /**
   * Nombre de la playlist
   */
  name: string | 'New Playlist',
  /**
   * Cancion/s de la playlist
   */
  song: string[],
  /**
   * Duración (en segundos) de la playlist
   */
  duration: number,
  /**
   * Genero/s de la playlist
   */
  genre: Genre[],
}

/**
 * Modelo mongoose de una playlist
 */
const PlaylistSchema = new Schema<PlaylistDocumentInterface>({
  /**
   * Nombre de la playlist
   */
  name: {
    type: String,
    trim: true,
    default: `New Playlist`,
    validate: (value: string) => {
      if (!validator.isAlphanumeric(value, 'es-ES', {ignore: ' '})) {
        throw new Error('A playlist name must contain alphanumeric characters only');
      }
    },
  },
  /**
   * Cancion/es de la playlist
   */
  song: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length === 0) {
        throw new Error('A playlist must has at least one song');
      }
    },
  },
  /**
   * Duración (en segundos) de la playlist
   */
  duration: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('A playlist duration cant be negative');
      }
    },
  },
  /**
   * Genero/s de la playlist
   */
  genre: {
    type: [String],
    required: true,
    validate: (value: string[]) => {
      if (value.length == 0) {
        throw new Error('A playlist must has at least one genre');
      } else if (!value.every((genre) => GenreArray.includes(genre))) {
        throw new Error('Invalid genre');
      }
    },
  },
});

export const Playlist = model<PlaylistDocumentInterface>('Playlist', PlaylistSchema);
