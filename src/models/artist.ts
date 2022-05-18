import {Document, Schema, model} from 'mongoose';
import {Genre, GenreArray} from './genre';

interface ArtistDocumentInterface extends Document {
  name: string,
  genre: Genre,
  songs: string[],
  monthlyListeners: number
}

const ArtistSchema = new Schema<ArtistDocumentInterface>({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
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
