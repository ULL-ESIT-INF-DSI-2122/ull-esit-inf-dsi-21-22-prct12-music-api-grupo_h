import * as express from 'express';
import {Artist} from '../../models/artist';

export const deleteArtistRouter = express.Router();

deleteArtistRouter.delete('/artist', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'An artist name must be provided',
    });
  } else {
    Artist.findOneAndDelete({name: req.query.name.toString()}).then((artist) => {
      if (!artist) {
        res.status(404).send();
      } else {
        res.send(artist);
      }
    }).catch(() => {
      res.status(500).send();
    });
  }
});

deleteArtistRouter.delete('/artist/:id', (req, res) => {
  Artist.findByIdAndDelete(req.params.id).then((artist) => {
    if (!artist) {
      res.status(404).send();
    } else {
      res.send(artist);
    }
  }).catch(() => {
    res.status(500).send();
  });
});
