import * as express from 'express';
import {Song} from '../../models/song';

export const postSongRouter = express.Router();

/**
 * Crea una canción en la base de datos
 */
postSongRouter.post('/song', async (req, res) => {
  const song = new Song(req.body);
  try {
    await song.save();
    return res.status(201).send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});
