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
Implementación de una API RESTful para gestionar información musical, haciendo uso de Node/Express, permitiendo realizar peaciones como, creación, lectura, modificación y borrado (Create, Read, Update, Delete - CRUD) de canciones, artistas y playlists.

## db<a name="idb"></a>
### mongoose.ts

En este fichero encontramos el método connect para conectar con la base de datos, en el que recibe como primer argumento la URL de la base de datos y el segundo argumento es un objeto con las opciones de conexión. Como este metodo devuelve un promesa, en caso de que se cumpla se mostrara `'Connection to MongoDB server established'` y en caso contrario se mostrara `'Unnable to connect to MongoDB server'`.

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
En este direcorio se encuentran los esquemas y mopdelos mongoosse de un artista, genero, playlist y canción.
### Artist.ts
En este fichero encontramos la interfaz para el esquema de los arisstas, y el modelo mongoose para el esquema de artistas.

1. `ArtistDocumentInterface`: esquema de un artista conformada por su nombre, genero, canciones y oyentes mensuales

```typescript
interface ArtistDocumentInterface extends Document {
  name: string,
  genre: Genre[],
  song: string[],
  monthlyListeners: number
}
```

2. `ArtistSchema`: modelo monogoose para el esquema de artistas
Nos encontramos con el primero `name` que seria el nombre del artista, es de tipo `String`, también tenemos la opción `required` que permite especificar que esta propiedad del esquema debe especificarse obligatoriamente, la opción `unique` nos permite que no se pueda repetir el nombre de un artista, y la opción `trim` permite eliminar espacios no necesarios al principio y final de cada cadena de caracteres.

De segundo esta genre qye es de tipo `Array` de srtring, también posee las opciones require y trim, y contiene un validador que comprueba que el artista posea al menos un genero y también se comprueba que los géneros introducidos sea los correctos.

De tercero esta song que es de tipo `Array` de string, también posee las opciones require y trim, y contiene un validador que comprueba que el artista posea al menos una canción.

Por ultimo, tenemos a monthlyListeners que es de tipo `Number`, también posee las opciones require y trim, y contiene un validador que comprueba el numero de oyentes mensuales sea entero y que sea mayor que 0.

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

El esquema `PlaylistDocumentInterface` es una interfaz que hereda de Document, contiene las propiedades name de tipo string, song que seria un array de string, la duración y los géneros de la playlist.

```typescript	
interface PlaylistDocumentInterface extends Document {
  name: string,
  song: string[],
  duration: number,
  genre: Genre[],
}
```

El modelo `PlaylistSchema` es un modelo mongoose para el esquema de playlist. Es muy parecido que el de artitst pero con algunas diferencias.

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

`SongDocumentInterface` seria la interfaz de la canción, que hereda de Document, y contiene las propiedades title que seria el nobre de la cacion, author, nombre del autor de la cancion, duration, duracion, genre, genereos de la cancion, single, booleano que indica si la cacion es un single o no y reproductions, numero de reporducciones de la cancion.

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

`SongSchema` es el modelo mongoose para el esquema de canción. conpuesto por la porpiedades title, author, duration, genre, single y reproductions.

- `title` es de tipo string, tiene los atributos required, unique y trim.
- `author` es de tipo string, tiene los atributos required y trim.
- `duration` es de tipo number, tiene los atributos required, validate que comprueba que la duración de la canción sea un número entero mayor que 0.
- `genre` es de tipo Array de strings, tiene los atributos required, trim y validate que comprueba que la canción tenga al menos un género y que sea un genero correcto.
- `single` es de tipo boolean, tiene los atributos required.
- `reproductions` es de tipo number, tiene los atributos required, validate que comprueba que el numero de reproducciones de la canción sea un número entero mayor que 0.

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

