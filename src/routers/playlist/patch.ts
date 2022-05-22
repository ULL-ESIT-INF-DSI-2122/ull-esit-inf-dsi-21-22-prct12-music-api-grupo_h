import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const patchPlaylistRouter = express.Router();

/**
 * Modifica una playlist de la base de datos a partir de su nombre
 */
patchPlaylistRouter.patch('/playlist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({error: 'Request body cant be empty'});
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
    const playlist = await Playlist.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
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
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({error: 'Request body cant be empty'});
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
