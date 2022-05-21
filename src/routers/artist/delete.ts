import * as express from 'express';
import {Artist} from '../../models/artist';

export const deleteArtistRouter = express.Router();

/**
 * Elimina un artista de la base de datos a partir de su nombre
 */
deleteArtistRouter.delete('/artist', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }
  try {
    const artist = await Artist.findOneAndDelete({title: req.query.title.toString()});
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send();
  }
});

/**
 * Elimina un artista de la base de datos a partir de su id
 */
deleteArtistRouter.delete('/artist/:id', async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send();
  }
});
