import * as express from 'express';
import './db/mongoose';
import {postSongRouter} from './routers/song/post';
import {getSongRouter} from './routers/song/get';
import {deleteSongRouter} from './routers/song/delete';
import {patchSongRouter} from './routers/song/patch';
import {postPlaylistRouter} from './routers/playlist/post';
import {getPlaylistRouter} from './routers/playlist/get';
import {deletePlaylistRouter} from './routers/playlist/delete';
import {patchPlaylistRouter} from './routers/playlist/patch';
import {postArtistRouter} from './routers/artist/post';
import {getArtistRouter} from './routers/artist/get';
import {deleteArtistRouter} from './routers/artist/delete';
import {patchArtistRouter} from './routers/artist/patch';
import {defaultRouter} from './routers/default';

/**
 * Proceso de registro en la aplicación de cada uno de los routers creados
 */
const app = express();
app.use(express.json());

/**
 * Routers de 'Song'
 */
app.use(postSongRouter);
app.use(getSongRouter);
app.use(deleteSongRouter);
app.use(patchSongRouter);

/**
 * Routers de 'Artist'
 */
app.use(postArtistRouter);
app.use(getArtistRouter);
app.use(deleteArtistRouter);
app.use(patchArtistRouter);

/**
 * Routers de 'Playlist'
 */
app.use(postPlaylistRouter);
app.use(getPlaylistRouter);
app.use(deletePlaylistRouter);
app.use(patchPlaylistRouter);

/**
 * Router por defecto
 */
app.use(defaultRouter);

/**
 * Configuración del puerto de escucha
 */
const port = process.env.PORT || 3000;

/**
 * Punto de escucha del servidor
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
