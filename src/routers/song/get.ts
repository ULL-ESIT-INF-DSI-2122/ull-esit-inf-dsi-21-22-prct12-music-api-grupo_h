import * as express from 'express';
import {Song} from '../../models/song';

export const getSongRouter = express.Router();

getSongRouter.get('/song', async (req, res) => {
  const filter = req.query.title?{title: req.query.title.toString()}:{};
  try {
    const songs = await Song.find(filter);
    if (songs.length !== 0) {
      return res.send(songs);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

getSongRouter.get('/song/:id', async (req, res) => {
  try {
    const songs = await Song.findById(req.params.id);
    if (!songs) {
      return res.status(404).send();
    }
    return res.send(songs);
  } catch (error) {
    return res.status(500).send();
  }
});
