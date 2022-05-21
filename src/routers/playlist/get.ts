import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const getPlaylistRouter = express.Router();

/**
 * Obtiene una playlist de la base de datos a partir de su nombre
 */
getPlaylistRouter.get('/playlist', async (req, res) => {
  const filter = req.query.title?{title: req.query.title.toString()}:{};
  try {
    const playlists = await Playlist.find(filter);
    if (playlists.length !== 0) {
      return res.send(playlists);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Obtiene una playlist de la base de datos a partir de su id
 */
getPlaylistRouter.get('/playlist/:id', async (req, res) => {
  try {
    const playlists = await Playlist.findById(req.params.id);
    if (!playlists) {
      return res.status(404).send();
    }
    return res.send(playlists);
  } catch (error) {
    return res.status(500).send();
  }
});
