import path from 'path';
import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import ApiRouter from './routers/ApiRouter';
import http from 'http';
import config from './config';

const appBundleDirectory = path.resolve(__dirname, '..', '..', 'app', 'dist');
const MONGO_URI: string = config.mongoURI;

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
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'bukabuka',
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(`Unable to connected to MongoDB: ${err}`);
    });
  return new http.Server(app);
}
