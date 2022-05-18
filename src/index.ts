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


const app = express();
app.use(express.json());
app.use(postSongRouter);
app.use(getSongRouter);
app.use(deleteSongRouter);
app.use(patchSongRouter);

app.use(postPlaylistRouter);
app.use(getPlaylistRouter);
app.use(deletePlaylistRouter);
app.use(patchPlaylistRouter);

app.use(postArtistRouter);
app.use(getArtistRouter);
app.use(deleteArtistRouter);
app.use(patchArtistRouter);

app.use(defaultRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});


// run ddbb sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/
// en caso de tener el puerto ocupado
//  1º sudo lsof -t -i:27017
//  2º sudo kill _numero que nos de lo anterior_
