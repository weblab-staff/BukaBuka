import { Router } from 'express';
import ApiController from '../controllers/ApiController';
class ApiRouter {
  private _router = Router();

  constructor() {
    this._configure();
  }

  get router() {
    return this._router;
  }

  private _configure() {
    this.router.get('/happiness', (_, res) => {
      const happiness = ApiController.getHappiness();
      res.status(200).json({ happiness });
    });

    this.router.get('/alive', (_, res) => {
      ApiController.alive().then((alive) => {
        res.send({alive});
      })
      .catch(() => res.send({ alive: false}));
    })
  }
}

export default new ApiRouter().router;
