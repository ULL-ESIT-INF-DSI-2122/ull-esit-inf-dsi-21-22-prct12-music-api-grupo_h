import * as express from 'express';

export const defaultRouter = express.Router();

/**
 * Pagina por defecto
 */
defaultRouter.all('*', (_, res) => {
  res.status(501).send({
    error: 'This route is not implemented',
  });
});
