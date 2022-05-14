import * as express from 'express';
import {Playlist} from '../playlist';

export const getPlaylistRouter = express.Router();

getPlaylistRouter.get('/playlist', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Playlist.find(filter).then((playlists) => {
    if (playlists.length !== 0) {
      res.send(playlists);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

getPlaylistRouter.get('/playlist/:id', (req, res) => {
  Playlist.findById(req.params.id).then((playlist) => {
    if (!playlist) {
      res.status(404).send();
    } else {
      res.send(playlist);
    }
  }).catch(() => {
    res.status(500).send();
  });
});
