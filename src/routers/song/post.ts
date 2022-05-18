import * as express from 'express';
import {Song} from '../../models/song';

export const postSongRouter = express.Router();

postSongRouter.post('/song', (req, res) => {
  const song = new Song(req.body);

  song.save().then((song) => {
    res.status(201).send(song);
  }).catch((err) => {
    res.status(400).send(err);
  });
});
