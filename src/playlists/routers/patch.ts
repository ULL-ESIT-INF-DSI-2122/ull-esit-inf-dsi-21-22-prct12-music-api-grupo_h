import * as express from 'express';
import {Playlist} from '../playlist';

export const patchPlaylistRouter = express.Router();

patchPlaylistRouter.patch('/playlist', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['name', 'song', 'duration', 'genre'];
    const actualUpdates = Object.keys(req.query);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Ese atributo no se puede actualizar',
      });
    } else {
      Playlist.findOneAndUpdate({name: req.query.name.toString()}, req.query, {
        new: true,
        runValidators: true,
      }).then((playlist) => {
        if (!playlist) {
          res.status(404).send();
        } else {
          res.send(playlist);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

patchPlaylistRouter.patch('/playlist/:id', (req, res) => {
  const allowedUpdates = ['name', 'song', 'duration', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Ese atributo no se puede actualizar',
    });
  } else {
    Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((playlist) => {
      if (!playlist) {
        res.status(404).send();
      } else {
        res.send(playlist);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});
