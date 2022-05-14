import * as express from 'express';
import {Song} from '../song';

export const postRouter = express.Router();

postRouter.post('/song', (req, res) => {
  const song = new Song(req.query);

  if (req.query.genre) {
    song.save().then((song) => {
      res.status(201).send(song);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir el género de la canción'});
  }
});
