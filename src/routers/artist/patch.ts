import * as express from 'express';
import {Artist} from '../../models/artist';

export const patchArtistRouter = express.Router();

patchArtistRouter.patch('/Artist', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    const allowedUpdates = ['title', 'reproductions', 'genre'];
    const actualUpdates = Object.keys(req.query);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Ese atributo no se puede actualizar',
      });
    } else {
      Artist.findOneAndUpdate({name: req.query.name.toString()}, req.query, {
        new: true,
        runValidators: true,
      }).then((Artist) => {
        if (!Artist) {
          res.status(404).send();
        } else {
          res.send(Artist);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

patchArtistRouter.patch('/Artist/:id', (req, res) => {
  const allowedUpdates = ['title', 'reproductions', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Ese atributo no se puede actualizar',
    });
  } else {
    Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((Artist) => {
      if (!Artist) {
        res.status(404).send();
      } else {
        res.send(Artist);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});
