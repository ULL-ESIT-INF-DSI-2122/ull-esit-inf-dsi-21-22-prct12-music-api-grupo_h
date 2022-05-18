import * as express from 'express';
import {Song} from '../../models/song';

export const deleteSongRouter = express.Router();

deleteSongRouter.delete('/song', (req, res) => {
  if (!req.query.title) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    Song.findOneAndDelete({title: req.query.title.toString()}).then((song) => {
      if (!song) {
        res.status(404).send();
      } else {
        res.send(song);
      }
    }).catch(() => {
      res.status(500).send();
    });
  }
});

deleteSongRouter.delete('/song/:id', (req, res) => {
  Song.findByIdAndDelete(req.params.id).then((song) => {
    if (!song) {
      res.status(404).send();
    } else {
      res.send(song);
    }
  }).catch(() => {
    res.status(500).send();
  });
});