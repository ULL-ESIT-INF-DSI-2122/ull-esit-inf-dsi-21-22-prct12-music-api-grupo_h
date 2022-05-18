import * as express from 'express';
import {Song} from '../../models/song';

export const getSongRouter = express.Router();

getSongRouter.get('/song', (req, res) => {
  const filter = req.query.title?{title: req.query.title.toString()}:{};

  Song.find(filter).then((songs) => {
    if (songs.length !== 0) {
      res.send(songs);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

getSongRouter.get('/song/:id', (req, res) => {
  Song.findById(req.params.id).then((song) => {
    if (!song) {
      res.status(404).send();
    } else {
      res.send(song);
    }
  }).catch(() => {
    res.status(500).send();
  });
});
