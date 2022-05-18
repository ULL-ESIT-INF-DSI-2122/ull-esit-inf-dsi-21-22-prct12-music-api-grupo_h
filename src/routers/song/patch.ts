import * as express from 'express';
import {Song} from '../../models/song';

export const patchSongRouter = express.Router();

patchSongRouter.patch('/song', (req, res) => {
  if (!req.query.title) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    const allowedUpdates = ['title', 'author', 'duration', 'genre', 'single', 'reproductions'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Song.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((song) => {
        if (!song) {
          res.status(404).send();
        } else {
          res.send(song);
        }
      }).catch((error) => {
        res.status(500).send(error);
      });
    }
  }
});

patchSongRouter.patch('/song/:id', (req, res) => {
  const allowedUpdates = ['title', 'author', 'duration', 'genre', 'single', 'reproductions'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Update is not permitted',
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
      res.status(500).send(error);
    });
  }
});
