import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const postPlaylistRouter = express.Router();

postPlaylistRouter.post('/playlist', (req, res) => {
  const playlist = new Playlist(req.body);

  playlist.save().then((playlist) => {
    res.status(201).send(playlist);
  }).catch((err) => {
    res.status(400).send(err);
  });
});
