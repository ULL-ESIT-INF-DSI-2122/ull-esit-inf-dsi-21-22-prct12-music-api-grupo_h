import * as express from 'express';
import {Artist} from '../../models/artist';

export const postArtistRouter = express.Router();

/**
 * Crea un artista en la base de datos
 */
postArtistRouter.post('/artist', async (req, res) => {
  const artist = new Artist(req.body);
  try {
    await artist.save();
    return res.status(201).send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
