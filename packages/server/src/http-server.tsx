import path from 'path';
import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import bodyParser from 'body-parser';
import ApiRouter from './routers/ApiRouter';
import http from 'http';

const appRootDirectory = path.dirname(require.resolve('@bukabuka/app/package.json'));
const appBundleDirectory = path.join(appRootDirectory, 'dist/');

export function createHttpServer(): http.Server {
  const app = express();
  app.use(logger('dev'));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api', ApiRouter);
  app.get('/heartbeat', (_, res) => {
    res.status(200).send({ msg: 'hello world' });
  });
  app.use(express.static(appBundleDirectory));
  return new http.Server(app);
}
