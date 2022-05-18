import validator from 'validator';
import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

interface PlaylistDocumentInterface extends Document {
  name: string,
  song: string[],
  duration: number,
  genre: Genre[],
}

const PlaylistSchema = new Schema<PlaylistDocumentInterface>({
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
  duration: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('A playlist duration cant be negative');
      }
    },
  },
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
