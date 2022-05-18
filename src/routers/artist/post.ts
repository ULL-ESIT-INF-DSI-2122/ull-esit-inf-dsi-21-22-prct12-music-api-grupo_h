import * as express from 'express';
import {Artist} from '../../models/artist';

export const postArtistRouter = express.Router();

postArtistRouter.post('/artist', (req, res) => {
  const Artists = new Artist(req.query);

  if (req.query.genre) {
    Artists.save().then((Artist) => {
      res.status(201).send(Artist);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir el género de la canción'});
  }

  if (req.query.reproductions) {
    Artists.save().then((Artist) => {
      res.status(201).send(Artist);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir las reporoducciones del artista'});
  }

  if (req.query.name) {
    Artists.save().then((Artist) => {
      res.status(201).send(Artist);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir el nombre del artista'});
  }

  if (req.query.song) {
    Artists.save().then((Artist) => {
      res.status(201).send(Artist);
    }).catch((error) => {
      res.status(400).send(error);
    });
  } else {
    res.status(400).send({success: false, message: 'Se debe introducir al menos una canción'});
  }
});
