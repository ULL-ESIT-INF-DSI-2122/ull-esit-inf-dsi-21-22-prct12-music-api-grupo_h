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

2. `ArtistSchema`

