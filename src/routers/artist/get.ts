import * as express from 'express';
import {Artist} from '../../models/artist';

export const getArtistRouter = express.Router();

getArtistRouter.get('/artist', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Artist.find(filter).then((Artist) => {
    if (Artist.length !== 0) {
      res.send(Artist);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

getArtistRouter.get('/artist/:id', (req, res) => {
  Artist.findById(req.params.id).then((Artist) => {
    if (!Artist) {
      res.status(404).send();
    } else {
      res.send(Artist);
    }
  }).catch(() => {
    res.status(500).send();
  });
});
