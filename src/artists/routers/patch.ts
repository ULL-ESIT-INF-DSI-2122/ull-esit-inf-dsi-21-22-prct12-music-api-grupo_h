import * as express from 'express';
import {Song} from '../song';

export const patchSongRouter = express.Router();

patchSongRouter.patch('/song', (req, res) => {
  if (!req.query.title) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    const allowedUpdates = ['title', 'reproductions', 'genre'];
    const actualUpdates = Object.keys(req.query);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Ese atributo no se puede actualizar',
      });
    } else {
      Song.findOneAndUpdate({title: req.query.title.toString()}, req.query, {
        new: true,
        runValidators: true,
      }).then((song) => {
        if (!song) {
          res.status(404).send();
        } else {
          res.send(song);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

patchSongRouter.patch('/song/:id', (req, res) => {
  const allowedUpdates = ['title', 'reproductions', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Ese atributo no se puede actualizar',
    });
  } else {
    Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((song) => {
      if (!song) {
        res.status(404).send();
      } else {
        res.send(song);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});
