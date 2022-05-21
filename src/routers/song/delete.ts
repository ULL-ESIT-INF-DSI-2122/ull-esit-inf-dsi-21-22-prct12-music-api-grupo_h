import * as express from 'express';
import {Song} from '../../models/song';

export const deleteSongRouter = express.Router();

/** 
 * Elimina una canción de la base de datos a partir de su nombre
*/
deleteSongRouter.delete('/song', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }
  try {
    const song = await Song.findOneAndDelete({title: req.query.title.toString()});
    if (!song) {
      return res.status(404).send();
    }
    return res.send(song);
  } catch (error) {
    return res.status(400).send();
  }
});

/**
 * Elimina una canción de la base de datos a partir de su id
 */
deleteSongRouter.delete('/song/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).send();
    }
    return res.send(song);
  } catch (error) {
    return res.status(400).send();
  }
});
