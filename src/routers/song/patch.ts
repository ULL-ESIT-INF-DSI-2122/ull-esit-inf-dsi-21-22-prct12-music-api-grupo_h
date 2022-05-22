import * as express from 'express';
import {Song} from '../../models/song';

export const patchSongRouter = express.Router();

/**
 * Actualiza una canción de la base de datos a partir de su nombre
 */
patchSongRouter.patch('/song', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({error: 'Request body cant be empty'});
  }
  const allowedUpdates = ['title', 'author', 'duration', 'genre', 'single', 'reproductions'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const song = await Song.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) {
      return res.status(404).send();
    }
    return res.send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualiza una canción de la base de datos a partir de su id
 */
patchSongRouter.patch('/song/:id', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({error: 'Request body cant be empty'});
  }
  const allowedUpdates = ['title', 'author', 'duration', 'genre', 'single', 'reproductions'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) {
      return res.status(404).send();
    }
    return res.send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});
