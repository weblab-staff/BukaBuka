import { Router } from 'express';
import ApiController from '../controllers/ApiController';
class ApiRouter {
  private _router = Router();

  constructor() {
    this.configure();
  }

  get router() {
    return this._router;
  }

  private configure() {
    this.router.get('/alive', (_, res) => {
      ApiController.alive()
        .then((alive) => {
          res.send({ alive });
        })
        .catch(() => res.send({ alive: false }));
    });

    this.router.get('/happiness', (_, res) => {
      const happiness = ApiController.getHappiness();
      res.status(200).json({ happiness });
    });

    this._router.get('/questions', (_, res) => {
      const questions = ApiController.getQuestions();
      res.status(200).json({ questions });
    });

    this._router.get('/answers', (_, res) => {
      const answers = ApiController.getAnswers();
      res.status(200).json({ answers });
    });
  }
}

export default new ApiRouter().router;
