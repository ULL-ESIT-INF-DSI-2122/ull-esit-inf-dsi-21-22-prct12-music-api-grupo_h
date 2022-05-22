import * as express from 'express';
import {Artist} from '../../models/artist';

export const patchArtistRouter = express.Router();

/**
 * Actualiza un artista de la base de datos a partir de su nombre
 */
patchArtistRouter.patch('/artist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({error: 'Request body cant be empty'});
  }
  const allowedUpdates = ['name', 'genre', 'song', 'monthlyListeners'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const artist = await Artist.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualiza un artista de la base de datos a partir de su id
 */
patchArtistRouter.patch('/artist/:id', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({error: 'Request body cant be empty'});
  }
  const allowedUpdates = ['name', 'genre', 'song', 'monthlyListeners'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
