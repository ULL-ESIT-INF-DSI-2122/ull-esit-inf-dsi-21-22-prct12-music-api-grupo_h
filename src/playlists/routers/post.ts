import * as express from 'express';
import {Playlist} from '../playlist';

export const postPlaylistRouter = express.Router();

postPlaylistRouter.post('/playlist', (req, res) => {
  const playlist = new Playlist(req.query);

  if (req.query.genre) {
    playlist.save().then((playlist) => {
      res.status(201).send(playlist);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir el género de la canción'});
  }
});
