import * as express from 'express';
import {Artist} from '../artist';

export const deleteArtistRouter = express.Router();

deleteArtistRouter.delete('/artist', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'Se debe de introducir el nombre del artista',
    });
  } else {
    Artist.findOneAndDelete({name: req.query.name.toString()}).then((Artists) => {
      if (!Artists) {
        res.status(404).send();
      } else {
        res.send(Artists);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});

deleteArtistRouter.delete('/artist/:id', (req, res) => {
  Artist.findByIdAndDelete(req.params.id).then((Artist) => {
    if (!Artist) {
      res.status(404).send();
    } else {
      res.send(Artist);
    }
  }).catch(() => {
    res.status(400).send();
  });
});
