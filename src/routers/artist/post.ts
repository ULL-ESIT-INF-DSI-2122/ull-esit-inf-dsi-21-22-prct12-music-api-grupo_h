import * as express from 'express';
import {Artist} from '../../models/artist';

export const postArtistRouter = express.Router();

postArtistRouter.post('/artist', (req, res) => {
  const artist = new Artist(req.body);
  artist.save().then((artist) => {
    res.status(201).send(artist);
  }).catch((err) => {
    res.status(400).send(err);
  });
});
