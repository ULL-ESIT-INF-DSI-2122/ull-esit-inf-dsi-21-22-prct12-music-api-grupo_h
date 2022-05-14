import {Document, Schema, model} from 'mongoose';
import {Genre} from '../genre/genre';

interface ArtistDocumentInterface extends Document {
  author: string,
  genre: Genre,
  songs: string[],
  listeners: number
}

const ArtistSchema = new Schema<ArtistDocumentInterface>({
  author: {
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

export const Artis = model<ArtistDocumentInterface>('Artist', ArtisSchema);
