import { Router } from 'express';

class ApiRouter {
  private _router = Router();

  constructor() {
    this._configure();
    // eslint-disable-next-line no-console
    console.log('Loaded!');
  }

  get router() {
    return this._router;
  }

  private _configure() {
    this.router.get('/happiness', (_, res) => {
      res.status(200).json({ happiness: 1 });
    });
  }
}

export default new ApiRouter().router;
