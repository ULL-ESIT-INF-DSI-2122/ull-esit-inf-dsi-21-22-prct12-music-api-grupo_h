import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const patchPlaylistRouter = express.Router();

/**
 * Modifica una playlist de la base de datos a partir de su nombre
 */
patchPlaylistRouter.patch('/playlist', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }
  const allowedUpdates = ['name', 'song', 'duration', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const playlist = await Playlist.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Modifica una playlist de la base de datos a partir de su id
 */
patchPlaylistRouter.patch('/playlist/:id', async (req, res) => {
  const allowedUpdates = ['name', 'song', 'duration', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
