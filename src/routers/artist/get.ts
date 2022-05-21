import * as express from 'express';
import {Artist} from '../../models/artist';

export const getArtistRouter = express.Router();

/**
 * Obtiene un artista de la base de datos a partir de su nombre
 */
getArtistRouter.get('/artist', async (req, res) => {
  const filter = req.query.title?{title: req.query.title.toString()}:{};
  try {
    const artists = await Artist.find(filter);
    if (artists.length !== 0) {
      return res.send(artists);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Obtiene un artista de la base de datos a partir de su id
 */
getArtistRouter.get('/artist/:id', async (req, res) => {
  try {
    const artists = await Artist.findById(req.params.id);
    if (!artists) {
      return res.status(404).send();
    }
    return res.send(artists);
  } catch (error) {
    return res.status(500).send();
  }
});
