# Práctica 12 - API Node/Express de gestión de información musical

## Integrantes
- Jacob Santana Rodríguez [(alu0101330426@ull.edu.es)](alu0101330426@ull.edu.es)
- Ana Virginia Giambona Díaz [(alu0101322650@ull.edu.es)](alu0101322650@ull.edu.es)
- Hector Rodríguez Alonso [(alu0101365107@ull.edu.es)](alu0101365107@ull.edu.es)
- Adrián gonzález galván [(alu0101321219@ull.edu.es)](alu0101321219@ull.edu.es)

## Datos generales
- Universidad de la Laguna
- Grado en Ingeniería Informática 
- Curso nº 3, segundo cuatrimestre
- Asignatura: Desarrollo en Sistemas Informáticos
- Fecha de entrega: 22/05/2022

## Índice 
- [Introducción](#ida)
- [](#idb)
  - [](#id1)


## Introducción<a name="ida"></a>
Implementación de una API RESTful para gestionar información musical, haciendo uso de Node/Express, permitiendo realizar operaciones como, creación, lectura, modificación y borrado (Create, Read, Update, Delete - CRUD) de canciones, artistas y playlists.

## db<a name="idb"></a>
### mongoose.ts

En este fichero encontramos el método connect para conectar con la base de datos, en el que recibe como primer argumento la URL de la base de datos y el segundo argumento es un objeto con las opciones de conexión. Como este método devuelve una promesa, en caso de que se cumpla se mostrará `'Connection to MongoDB server established'` y en caso contrario se mostrará `'Unnable to connect to MongoDB server'`.

```typescript
const databaseURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/music-app';

connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unnable to connect to MongoDB server');
});
```

## models<a name="id1"></a>
En este directorio se encuentran los esquemas y modelos mongoose de un artista, genero, playlist y canción.
### Artist.ts
En este fichero encontramos la interfaz para el esquema de los artistas, y el modelo monogose para el esquema de artistas.

1. `ArtistDocumentInterface`: esquema de un artista conformada por su nombre, género, canciones y oyentes mensuales

```typescript
interface ArtistDocumentInterface extends Document {
  name: string,
  genre: Genre[],
  song: string[],
  monthlyListeners: number
}
```

2. `ArtistSchema`: modelo mongoose para el esquema de artistas
Nos encontramos con el primero `name` que seria el nombre del artista, es de tipo `String`, también tenemos la opción `required` que permite especificar que esta propiedad del esquema debe especificarse obligatoriamente, la opción `unique` nos permite que no se pueda repetir el nombre de un artista, y la opción `trim` permite eliminar espacios no necesarios al principio y final de cada cadena de caracteres.

De segundo esta genre que es de tipo `Array` de string, también posee las opciones require y trim, y contiene un validador que comprueba que el artista posea al menos un género y también se comprueba que los géneros introducidos sean los correctos.

De tercero esta song que es de tipo `Array` de string, también posee las opciones require y trim, y contiene un validador que comprueba que el artista posea al menos una canción.

Por último, tenemos a monthlyListeners que es de tipo `Number`, también posee las opciones require y trim, y contiene un validador que comprueba que el número de oyentes mensuales sea entero y que sea mayor que 0.

Al final invocamos el método `model` para crear el modelo de esquema de artistas.


```typescript

const ArtistSchema = new Schema<ArtistDocumentInterface>({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  genre: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length == 0) {
        throw new Error('An artist must has at least one genre');
      } else if (!value.every((genre) => GenreArray.includes(genre))) {
        throw new Error('Invalid genre');
      }
    },
  },
  song: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length === 0) {
        throw new Error('An artist must has at least one song');
      }
    },
  },
  monthlyListeners: {
    type: Number,
    required: true,
    trim: true,
    validate: (value: number) => {
      if (!Number.isInteger(value)) {
        throw new Error('Value of monthly listeners must be an integer');
      } else if (value < 0) {
        throw new Error('An artist cant has negative monthly listeners');
      }
    },
  },
});

export const Artist = model<ArtistDocumentInterface>('Artist', ArtistSchema);
```

### Genre.ts
Encontramos un alias de tipo empleado para catalogar los distintos géneros musicales que englobamos en nuestra base de datos.

```typescript
export type Genre = 'Rock' | 'Heavy Metal' | 'Reggaeton' | 'Jazz' | 'Pop' | 'Rap' |
  'Hip-hop' | 'Trap' | 'Urban' | 'Latino' | 'Bachata' | 'Music alternative' | 'Electro';
```

Por otro lado, tenemos un array con los distintos géneros musicales.
```typescript
export const GenreArray = ['Rock', 'Heavy Metal', 'Reggaeton', 'Jazz', 'Pop', 'Rap',
  'Hip-hop', 'Trap', 'Urban', 'Latino', 'Bachata', 'Music alternative', 'Electro'];
```

### Playlist.ts
Encontramos el esquema de playlist, y el modelo mongoose para el esquema de playlist.

El esquema `PlaylistDocumentInterface` es una interfaz que hereda de Document, contiene las propiedades name de tipo string, song que sería un array de string, la duración y los géneros de la playlist.

```typescript	
interface PlaylistDocumentInterface extends Document {
  name: string,
  song: string[],
  duration: number,
  genre: Genre[],
}
```

El modelo `PlaylistSchema` es un modelo mongoose para el esquema de playlist. Es muy parecido al artista pero con algunas diferencias.

En la propiedad name, posee un valor por defecto que en el caso de que no se especifique, el nombre de la playlist será `New Playlist`, y además, posee un validador que comprueba que el nombre de la playlist sea alfanumérico.

La propiedad song, posee un validador que comprueba que la playlist tenga al menos una canción.

`duration` es de tipo number, posee un validador que comprueba que la duración de la playlist sea un número entero mayor que 0.

El resto es igual.

```typescript	
interface PlaylistDocumentInterface extends Document {
  name: string,
  song: string[],
  duration: number,
  genre: Genre[],
}

const PlaylistSchema = new Schema<PlaylistDocumentInterface>({
  name: {
    type: String,
    trim: true,
    default: `New Playlist`,
    validate: (value: string) => {
      if (!validator.isAlphanumeric(value, 'es-ES', {ignore: ' '})) {
        throw new Error('A playlist name must contain alphanumeric characters only');
      }
    },
  },
  song: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length === 0) {
        throw new Error('A playlist must has at least one song');
      }
    },
  },
  duration: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('A playlist duration cant be negative');
      }
    },
  },
  genre: {
    type: [String],
    required: true,
    validate: (value: string[]) => {
      if (value.length == 0) {
        throw new Error('A playlist must has at least one genre');
      } else if (!value.every((genre) => GenreArray.includes(genre))) {
        throw new Error('Invalid genre');
      }
    },
  },
});

export const Playlist = model<PlaylistDocumentInterface>('Playlist', PlaylistSchema);
```


### song.ts

Posee el esquema de canción, y el modelo mongoose para el esquema de canción.

`SongDocumentInterface` seria la interfaz de la canción, que hereda de Document, y contiene las propiedades title que sería el nombre de la canción, author, nombre del autor de la canción, duration, duración, genre, géneros de la canción, single, booleano que indica si la canción es un single o no y reproductions, número de reproducciones de la canción.


```typescript
interface SongDocumentInterface extends Document {
  title: string,
  author: string,
  duration: number,
  genre: Genre[],
  single: boolean,
  reproductions: number
}
```

`SongSchema` es el modelo mongoose para el esquema de canción. Compuesto por la porpiedades title, author, duration, genre, single y reproductions.

- `title` es de tipo string, tiene los atributos required, unique y trim.
- `author` es de tipo string, tiene los atributos required y trim.
- `duration` es de tipo number, tiene los atributos required, validate que comprueba que la duración de la canción sea un número entero mayor que 0.
- `genre` es de tipo Array de strings, tiene los atributos required, trim y validate que comprueba que la canción tenga al menos un género y que sea un género correcto.
- `single` es de tipo boolean, tiene los atributos required.
- `reproductions` es de tipo number, tiene los atributos required, validate que comprueba que el número de reproducciones de la canción sea un número entero mayor que 0.


```typescript
const SongSchema = new Schema<SongDocumentInterface>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('A song duration must be greater than zero');
      }
    },
  },
  genre: {
    type: [String],
    required: true,
    trim: true,
    validate: (value: string[]) => {
      if (value.length == 0) {
        throw new Error('A song must has at least one genre');
      } else if (!value.every((genre) => GenreArray.includes(genre))) {
        throw new Error('Invalid song genre');
      }
    },
  },
  single: {
    type: Boolean,
    required: true,
  },
  reproductions: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (!Number.isInteger(value)) {
        throw new Error('Value of song reproductions must be an integer');
      } else if (value <= 0) {
        throw new Error('Value of song reproductions must be greater than zero');
      }
    },
  },
});

export const Song = model<SongDocumentInterface>('Song', SongSchema);

```	

## Routes
### artist
Encontramos los métodos delete, get, post y patch de un artista

#### delete
Se encarga de eliminar un artista de la base de datos, llamado al método delete de mongoose.

Posee dos llamadas al método delete, una que se encarga de eliminar al artista a partir del nombre de este ya que como se comentó anteriormente el nombre de un artista es único. Primero comprobamos que se introduzca el nombre del artista, en caso contrario se devuelve un estado 400 y se indica que se debe introducir un nombre de artista. Luego se comprueba que el nombre del artista no exista, si se completa se envía el artista y en caso contrario se devuelve en 404. En caso de que se produzca algún error se devuelve un estado 400.

```typescript
deleteArtistRouter.delete('/artist', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }
  try {
    const artist = await Artist.findOneAndDelete({title: req.query.title.toString()});
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send();
  }
});
```

La segunda llamada al método delete se encarga de eliminar al artista a partir del id. Llamamos al método findByIdAndDelete de mongoose, y le pasamos el id del artista que queremos eliminar.
Si el artista no existe se devuelve un estado 404. En caso de que se produzca algún error se devuelve un estado 400. Si todo va bien se devuelve el artista eliminado.

```typescript
deleteArtistRouter.delete('/artist/:id', async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send();
  }
});
```


#### get
Se encarga de devolver un artista de la base de datos, está compuesto por dos llamadas al método.

La primera, se encarga de obtener un artista a partir del nombre de este, utilizando el método find de mongoose. Si no se introduce el nombre de un artista o no se encuentra, se devuelve un estado 404 y en caso de algún error se devuelve un 500.

```typescript
getArtistRouter.get('/artist', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try {
    const artists = await Artist.find(filter);
    if (artists.length !== 0) {
      return res.send(artists);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});
```
La segunda llamada, es parecida a la primera, pero se encarga de obtener un artista a partir del id.

```typescript
getArtistRouter.get('/artist/:id', async (req, res) => {
  try {
    const artists = await Artist.findById(req.params.id);
    if (!artists) {
      return res.status(404).send();
    }
    return res.send(artists);
  } catch (error) {
    return res.status(500).send();
  }
});
```

#### patch

Se encarga de actualizar un artista de la base de datos, está compuesto por dos llamadas al método.

La primera llamada se encarga de actualizar un artista a partir de su nombre utilizando el método `findOneAndUpdate` de mongoose. 

Se comprueba si se ha indicado el nombre del artista, si no se introduce el nombre se devuelve un estado 400 y se muestra el mensaje `A name must be provided`, posteriormente se comprueba que los datos proporcionados pertenecen al conjunto de actualizaciones permitidas, en caso de que no los sean se devuelve un estado 400. Posteriormente se usa el método `findOneAndUpdate` para actualizar al artista, y se devuelve el artista actualizado, en caso de que no se encuentre el artista se devuelve un estado 404. En caso de que se produzca algún error se devuelve un estado 400.

```typescript
patchArtistRouter.patch('/artist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  const allowedUpdates = ['name', 'genre', 'song', 'monthlyListeners'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const artist = await Artist.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

La segunda llamada, es parecida a la anterior con la diferencia de que se encarga de actualizar un artista a partir de su id, usando el método `findByIdAndUpdate` de mongoose.

```typescript
patchArtistRouter.patch('/artist/:id', async (req, res) => {
  const allowedUpdates = ['name', 'genre', 'song', 'monthlyListeners'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) {
      return res.status(404).send();
    }
    return res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

#### post

Se encarga de crear un artista en la base de datos. Usa el método `save` de mongoose para crear el artista. Si se produce algún error se devuelve un estado 400. en caso de que se cree correctamente el artista se devuelve un estado 201.

```typescript
postArtistRouter.post('/artist', async (req, res) => {
  const artist = new Artist(req.body);
  try {
    await artist.save();
    return res.status(201).send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

### Playlist
De igual forma que en Artista, la playlist está conformada por delete, get, patch y post.
#### delete
Se encarga de eliminar una playlist de la base de datos, está compuesto por dos llamadas al método.

La primera llamada se encarga de eliminar una playlist a partir de su nombre, utilizando el método `findOneAndDelete` de mongoose.

```typescript
deletePlaylistRouter.delete('/playlist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  try {
    const playlist = await Playlist.findOneAndDelete({name: req.query.name.toString()});
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send();
  }
});
```
La segunda llamada es parecida a la primera, pero se encarga de eliminar una playlist a partir de su id, utilizando el método `findByIdAndDelete` de mongoose.

```typescript
deletePlaylistRouter.delete('/playlist/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send();
  }
});
```

#### get
Se encarga de devolver una playlist de la base de datos, está compuesto por dos llamadas al método.

El primer método se encarga de devolver una playlist a partir de su nombre, utilizando el método `find` de mongoose.

```typescript
getPlaylistRouter.get('/playlist', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try {
    const playlists = await Playlist.find(filter);
    if (playlists.length !== 0) {
      return res.send(playlists);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});
```

La segunda llamada se encarga de devolver una playlist a partir de su id, utilizando el método `findById` de mongoose.

```typescript
getPlaylistRouter.get('/playlist/:id', async (req, res) => {
  try {
    const playlists = await Playlist.findById(req.params.id);
    if (!playlists) {
      return res.status(404).send();
    }
    return res.send(playlists);
  } catch (error) {
    return res.status(500).send();
  }
});
```

#### patch
Se encarga de actualizar una playlist de la base de datos, está compuesto por dos llamadas al método.

La primera llamada se encarga de actualizar una playlist a partir de su nombre, utilizando el método `findOneAndUpdate` de mongoose.

```typescript
patchPlaylistRouter.patch('/playlist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  const allowedUpdates = ['name', 'song', 'duration', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const playlist = await Playlist.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

La segunda llamada se encarga de actualizar una playlist a partir de su id, utilizando el método `findByIdAndUpdate` de mongoose.

```typescript
patchPlaylistRouter.patch('/playlist/:id', async (req, res) => {
  const allowedUpdates = ['name', 'song', 'duration', 'genre'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!playlist) {
      return res.status(404).send();
    }
    return res.send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```
#### post
Se encarga de crear una playlist en la base de datos, utilizando el método `save` de mongoose.
```typescript
postPlaylistRouter.post('/playlist', async (req, res) => {
  const playlist = new Playlist(req.body);
  try {
    await playlist.save();
    return res.status(201).send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

### songs
#### delete
Se encarga de eliminar una canción de la base de datos, está compuesto por dos llamadas al método.

La primera llamada se encarga de eliminar una canción a partir de su nombre, utilizando el método `findOneAndDelete` de mongoose.


```typescript
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
```

La segunda llamada se encarga de eliminar una canción a partir de su id, utilizando el método `findByIdAndDelete` de mongoose.

```typescript
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
```

#### get
Se encarga de devolver una canción de la base de datos, está compuesto por dos llamadas al método.

La primera llamada se encarga de devolver una canción a partir de su nombre, utilizando el método `find` de mongoose.


```typescript
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
```

La segunda llamada se encarga de devolver una canción a partir de su id, utilizando el método `findById` de mongoose.

```typescript
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
```

#### patch
Se encarga de actualizar una canción de la base de datos, está compuesto por dos llamadas al método.

La primera llamada se encarga de actualizar una canción a partir de su nombre, utilizando el método `findOneAndUpdate` de mongoose.

```typescript
patchSongRouter.patch('/song', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }
  const allowedUpdates = ['title', 'author', 'duration', 'genre', 'single', 'reproductions'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const song = await Song.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) {
      return res.status(404).send();
    }
    return res.send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```
La segunda llamada se encarga de actualizar una canción a partir de su id, utilizando el método `findByIdAndUpdate` de mongoose.

```typescript
patchSongRouter.patch('/song/:id', async (req, res) => {
  const allowedUpdates = ['title', 'author', 'duration', 'genre', 'single', 'reproductions'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) {
      return res.status(404).send();
    }
    return res.send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

#### post
Se encarga de crear una canción en la base de datos, utilizando el método `save` de mongoose.

```typescript
postSongRouter.post('/song', async (req, res) => {
  const song = new Song(req.body);
  try {
    await song.save();
    return res.status(201).send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

### Default
Podemos encontrar al método all  combinación con * como su primer argumento que indica que cualquiera que sea el método utilizado para llevar a cabo la petición, si la ruta especificada en dicha petición no está implementada, el servidor responderá, simplemente, con un estado 501.

```typescript	
defaultRouter.all('*', (_, res) => {
  res.status(501).send({
    error: 'This route is not implemented',
  });
});
```

## Index
Podemos encontrar llamadas a los distintos métodos comentados anteriormente, también tenemos la llamada. Por último, invocamos al método listen del objeto Express para indicar que el servidor va a estar a la espera de peticiones a través del puerto 3000.

```typescript
const app = express();
app.use(express.json());

app.use(postSongRouter);
app.use(getSongRouter);
app.use(deleteSongRouter);
app.use(patchSongRouter);

app.use(postArtistRouter);
app.use(getArtistRouter);
app.use(deleteArtistRouter);
app.use(patchArtistRouter);

app.use(postPlaylistRouter);
app.use(getPlaylistRouter);
app.use(deletePlaylistRouter);
app.use(patchPlaylistRouter);

app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
```
