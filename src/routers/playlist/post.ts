import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const postPlaylistRouter = express.Router();

postPlaylistRouter.post('/playlist', async (req, res) => {
  const playlist = new Playlist(req.body);
  try {
    await playlist.save();
    return res.status(201).send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
