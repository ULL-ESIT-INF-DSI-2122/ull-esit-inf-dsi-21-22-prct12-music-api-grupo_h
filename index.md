# Práctica 12 - API Node/Express de gestión de información musical

## Integrantes
- Jacob Santana Rodríguez [(alu0101330426@ull.edu.es)](alu0101330426@ull.edu.es)
- Ana Virginia Giambona Díaz [(alu0101322650@ull.edu.es)](alu0101322650@ull.edu.es)
- Héctor Rodríguez Alonso [(alu0101365107@ull.edu.es)](alu0101365107@ull.edu.es)
- Adrián gonzález galván [(alu0101321219@ull.edu.es)](alu0101321219@ull.edu.es)

## Datos generales
- Universidad de la Laguna
- Grado en Ingeniería Informática 
- Tercer año, segundo cuatrimestre
- Asignatura: Desarrollo en Sistemas Informáticos
- Fecha de entrega: 22/05/2022

## Índice 
- [Introducción](#introducción)
- [Database](#database)
- [Models](#models)
- [Routers](#routers)
- [Index.ts](#index.ts)
- [Referencias](#referencias)


## Introducción

En el siguiente informe se recoge la explicación detallada de la solución propuesta para el desarrollo de la __segunda práctica grupal__ de la asignatura de __Desarrollo en Sistemas Informáticos__. Esta se trata de implementar una **API REST** haciendo uso de Node/Express con la que se puedan llevar a cabo operaciones de creación, lectura, modificación y borrado (Create, Read, Update, Delete) sobre estructuras de datos de información musical. En concreto, estas estructuras son 3: canciones, playlists y artistas.

Para su implementación se ha empleado `MongoDB\MongoDB Atlas` para la creación de una base de datos no relacional y `Mongoose` para gestionar la base de datos desde Node.js. Asimismo, se ha utilizado `Heroku` para desplegar el API y poder realizar las peticiones de forma remota.

Podemos encontrar más información acerca de la práctica en el [guión](https://ull-esit-inf-dsi-2122.github.io/prct12-music-api/) de la misma.

## Database  

La base de datos está basada en la librería Moongose, la cual permite escribir consultas a una base de datos basada en MongooDB. En nuestro caso, esta se encuentra desplegada en MoongoDB Atlas Database.

### mongoose.ts

Este fichero posee el método connect el cual crea la conexión con la base de datos. Para ello tenemos la constante `databaseURL`, la cual en caso de que exista la variable de entorno `process.env.MONGODB_URL`, obtendrá dicho y valor, en caso contrario, poseerá la URL a la base de datos local. Respecto al método connect, este recibe como primer argumento la URL de la base de datos y el segundo argumento es un objeto con las opciones de conexión. Como este método devuelve una promesa, en caso de que se cumpla se mostrará `'Connection to MongoDB server established'` y en caso contrario se mostrará `'Unnable to connect to MongoDB server'`.  

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

## Models  
Debido al uso de Moongose, necesitamos la creación de esquemas con los cuales podamos modelar las opciones de un objeto para su almacenamiento en la base de datos, por lo que encontramos los esquemas y modelos de artista, género, playlist y canción en este directorio.

### genre.ts
Tanto los artistas, como las canciones o las playlists poseen uno o varios géneros. Así pues, con el objetivo de que el usuario no pueda introducir géneros inexistentes hemos pensado en emplear un alias de tipo.

```typescript
export type Genre = 'Rock' | 'Heavy Metal' | 'Reggaeton' | 'Jazz' | 'Pop' | 'Rap' |
  'Hip-hop' | 'Trap' | 'Urban' | 'Latino' | 'Bachata' | 'Music alternative' | 'Electro';
```

Además, poseemos un array con los distintos géneros musicales, los cuales usamos para validar los géneros introducidos por el usuario en el esquema.
```typescript
export const GenreArray = ['Rock', 'Heavy Metal', 'Reggaeton', 'Jazz', 'Pop', 'Rap',
  'Hip-hop', 'Trap', 'Urban', 'Latino', 'Bachata', 'Music alternative', 'Electro'];
```

### artist.ts
En este fichero encontramos una interfaz que se extiende de `Document`y contiene los atributos name, genre, song y monthlyListeners que representan al artista.

```typescript
interface ArtistDocumentInterface extends Document {
  name: string,
  genre: Genre[],
  song: string[],
  monthlyListeners: number
}
```

`ArtistSchema`: modelo mongoose para el esquema de artistas
Nos encontramos primero con el `name` una variable con el `String` que representa el nombre del artista, también tenemos la opción `required` que permite especificar que esta propiedad del esquema debe especificarse obligatoriamente, la opción `unique` que como su nombre indica, nos obliga a que este atributo en este caso name una vez se especifique no puede cambiar, y la opción `trim` permite eliminar espacios al principio y final de cada cadena de caracteres.

Segundo, esta genre que es un `Array` de string, también contiene las opciones require y trim, y tiene un validador que comprueba que el array no está vacío y que el género este incluido dentro del type importado.

Tercero, encontramos a song que tambien es `Array` de string, y sigue la misma estructura que el género lo que el validador cambia, en este caso el validador comprueba que el array no esté vacío.

Por último, tenemos a monthlyListeners que es de tipo `Number`, y como los anteriores sigue el mismo esquema, y su validador comprueba que el valor de esta variable tiene que ser un valor un entero y además también comprueba que el valor no sea negativo.

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

### playlist.ts
Encontramos el esquema de playlist, y el modelo mongoose para el esquema de playlist.

El esquema `PlaylistDocumentInterface` es una interfaz que hereda de Document, contiene las propiedades name de tipo string, song que es un array de string, la duración de tipo number y los géneros de la playlist.

```typescript	
interface PlaylistDocumentInterface extends Document {
  name: string,
  song: string[],
  duration: number,
  genre: Genre[],
}
```

El modelo `PlaylistSchema` es un modelo mongoose para el esquema de playlist. Es muy parecido al artista pero con algunas diferencias.

En la propiedad name, posee un valor por defecto que en el caso de que no se especifique y este valor por defecto es `New Playlist`, además, posee un validador que comprueba que el nombre de la playlist sea alfanumérico.

La propiedad song, es un array de string, contiene las opciones required y trim ya mencionadas anteriormente. Contine un validador que comprueba que el array no esté vacío.

Luego está la propiedad duration, es de tipo number, y contiene la opción rquired, posee un validador que comprueba que la duración de la playlist sea un número entero mayor que 0.

Y luego está la propiedad genre, que se trata de un array de strng, tiene la opcion de required y un validador que verifica que el array no esté vacío y, además, que se encuentre dentro del type exportado.

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

`SongDocumentInterface` es la interfaz de la canción, que hereda de Document, y contiene las propiedades title que es el nombre de la canción, author, autor de la canción, duration, la duración, genre, géneros de la canción, single, booleano que indica si la canción es un single o no y reproductions, número de reproducciones de la canción.


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

## Routers  
Directorio el cual posee todos los manejadores para las rutas establecidas, en nuestro caso `/artist`, `/song` y `playlist`.   
### Artist
Encontramos los métodos `delete`, `get`, `post` y `patch` de un artista. 

#### delete.ts
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

La segunda llamada al método delete se encarga de eliminar al artista a partir del id. Llamamos al método `findByIdAndDelete` de mongoose, y le pasamos el id del artista que queremos eliminar.
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


#### get.ts
Se encarga de devolver un artista de la base de datos, está compuesto por dos llamadas al método.

La primera, se encarga de obtener un artista a partir del nombre de este, utilizando el método `find` de mongoose. Si no se introduce el nombre de un artista o no se encuentra, se devuelve un estado 404 y en caso de algún error se devuelve un 500.

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

#### patch.ts

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

#### post.ts

Se encarga de crear un artista en la base de datos. Usa el método `save` de mongoose para crear el artista. Si se produce algún error se devuelve un estado 400, en caso de que se cree correctamente el artista se devuelve un estado 201.

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
De igual forma que en Artista, la playlist está conformada por `delete`, `get`, `patch` y `post`.
#### delete.ts
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

#### get.ts
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

#### patch.ts
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
#### post.ts
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

### Songs  
De igual forma que en Playlist, las canciones están conformadas por `delete`, `get`, `patch` y `post`.
#### delete.ts
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

#### get.ts
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

#### patch.ts
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

#### post.ts
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

### default.ts
En caso de que una ruta no esté implementada, el servidor responderá al usuario con un estado 501.

```typescript	
defaultRouter.all('*', (_, res) => {
  res.status(501).send({
    error: 'This route is not implemented',
  });
});
```

## Index.ts
En cuanto a la creación del servidor, se usa `express()`, el cual devuelve un objeto `Express`. Además indicamos el uso de los routers creados anteriormente e indicamos que las peticiones se parseen en formato JSON, pudiendo acceder directamente a las propiedades sin el uso de `JSON.parse`. Por útlimo, se crea la constante `port`, la cual puede obtener el valor de la variable de entorno `process.env.PORT` si existe, de lo contrario, está poseerá el valor `3000`. Para poder recibir las peticiones, indicamos al servidor que se ponga a escuchar en el puerto cuyo valor es el de la variable `PORT`.

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

## ThunderClient
Para la realización de los test de comprobación de nuestro código se ha hecho uso de la herramienta __Thunder Client__. Esta es una extensión disponible en `Visual Studio Code` que empleamos para realizar peticiones a nuestra API desplegada en Heroku. En la siguiente imagen podemos observar la ejecución secuencial de un conjunto de peticiones realizadas a la misma.
![](https://gyazo.com/51ad8717ccda977cc69e51dc66dd9a2a.png)

La herramienta en sí es bastante intuitiva y sencila de utilizar. Sin embargo, trabajando con ella nos encontramos con un problema relacionado con las operaciones que emplean identificadores, dado a que los identificadores de los objetos de nuestra base de datos son generados de manera aleatoria en el momento de ser creados. Esto provoca que las operaciones que los utilizen rara vez generen un acierto. Asi pues, en la siguiente imagen podemos apreciar que el método de actualización de una determinada canción genera un error dado a que el identificador empleado no coincide con ninguno de los de las playlists creadas anteriormente.
![](https://gyazo.com/8d2bb3930af34aad546929bb20d143f6.png)

## Referencias
- [Práctica 12 - API Node/Express de gestión de información musical](https://ull-esit-inf-dsi-2122.github.io/prct12-music-api/)