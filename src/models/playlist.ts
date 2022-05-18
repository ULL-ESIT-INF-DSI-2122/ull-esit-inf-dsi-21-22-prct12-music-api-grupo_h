import validator from 'validator';
import {Document, Schema, model} from 'mongoose';
import {Genre} from './genre';

interface PlaylistDocumentInterface extends Document {
  name: string,
  songs: string[],
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
  },
  duration: {
    type: Number,
    required: true,
    trim: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('A playlist duration cant be negative');
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
});

export const Playlist = model<PlaylistDocumentInterface>('Playlist', PlaylistSchema);
