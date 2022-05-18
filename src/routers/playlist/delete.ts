import * as express from 'express';
import {Playlist} from '../../models/playlist';

export const deletePlaylistRouter = express.Router();

deletePlaylistRouter.delete('/playlist', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe de introducir el nombre de la playlist',
    });
  } else {
    Playlist.findOneAndDelete({name: req.query.name.toString()}).then((playlist) => {
      if (!playlist) {
        res.status(404).send();
      } else {
        res.send(playlist);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});

deletePlaylistRouter.delete('/playlist/:id', (req, res) => {
  Playlist.findByIdAndDelete(req.params.id).then((playlist) => {
    if (!playlist) {
      res.status(404).send();
    } else {
      res.send(playlist);
    }
  }).catch(() => {
    res.status(400).send();
  });
});
