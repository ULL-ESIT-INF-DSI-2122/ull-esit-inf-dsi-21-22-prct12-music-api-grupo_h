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
