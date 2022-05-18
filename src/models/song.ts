import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

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
    required: true,
    unique: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('A song duration must be greater than zero');
      }
    },
  },
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
  single: {
    type: Boolean,
    required: true,
  },
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
