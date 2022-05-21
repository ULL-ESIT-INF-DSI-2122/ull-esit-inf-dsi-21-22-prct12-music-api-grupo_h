import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const deletePlaylistRouter = express.Router();

/**
 * Elimina una playlist de la base de datos a partir de su nombre
 */
deletePlaylistRouter.delete('/playlist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  try {
    const playlist = await Playlist.findOneAndDelete({name: req.query.name.toString()});
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send();
  }
});

/**
 * Elimina una playlist de la base de datos a partir de su id
 */
deletePlaylistRouter.delete('/playlist/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send();
  }
});
