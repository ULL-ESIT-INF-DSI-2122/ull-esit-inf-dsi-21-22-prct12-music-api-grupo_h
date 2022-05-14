import * as express from 'express';
import './db/mongoose';
import {postSongRouter} from './songs/routers/post';
import {getSongRouter} from './songs/routers/get';
import {deleteSongRouter} from './songs/routers/delete';
import {patchSongRouter} from './songs/routers/patch';
import {defaultRouter} from './default';


const app = express();
app.use(express.json());
app.use(postSongRouter);
app.use(getSongRouter);
app.use(deleteSongRouter);
app.use(patchSongRouter);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});


// run ddbb sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/
// en caso de tener el puerto ocupado
//  1º sudo lsof -t -i:27017
//  2º sudo kill _numero que nos de lo anterior_
