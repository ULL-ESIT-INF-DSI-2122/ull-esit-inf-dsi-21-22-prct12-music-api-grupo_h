import * as express from 'express';
import {Artist} from '../artist';

export const postArtistRouter = express.Router();

postArtistRouter.post('/artist', (req, res) => {
  const Artist = new Artist(req.query);

  if (req.query.genre) {
    Artist.save().then((Artist) => {
      res.status(201).send(Artist);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir el género de la canción'});
  }
});
