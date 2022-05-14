import * as express from 'express';
import {Song} from '../song';

export const deleteSongRouter = express.Router();

deleteSongRouter.delete('/song', (req, res) => {
  if (!req.query.title) {
    res.status(400).send({
      error: 'Se debe de introducir el nombre de la canción',
    });
  } else {
    Song.findOneAndDelete({title: req.query.title.toString()}).then((song) => {
      if (!song) {
        res.status(404).send();
      } else {
        res.send(song);
      }
    }).catch(() => {
      res.status(400).send();
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
    res.status(400).send();
  });
});
