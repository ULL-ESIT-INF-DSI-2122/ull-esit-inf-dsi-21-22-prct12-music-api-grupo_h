import {connect} from 'mongoose';

const databaseURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/music-app';

/**
 * Conexion a la base de datos
 */
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
