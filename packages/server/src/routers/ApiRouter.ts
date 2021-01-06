/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router, Request, Response } from 'express';
import BukaBukaService from '../services/BukaBukaService';
import { postQuestionValidation, postHappinessValidation } from '../middleware/validation/api-validator';
import validate from '../middleware/validation/validation';
import auth from '../middleware/auth';
class ApiRouter {
  private _router = Router();

  constructor() {
    this.configure();
  }

  get router() {
    return this._router;
  }

  private configure() {
    this.configureAdminRoutes();
    this.configurePublicRoutes();
  }

  private configureAdminRoutes() {
    this.router.post('/wakeup', auth, (_, res) => {
      BukaBukaService.wakeUpBukaBuka()
        .then(() => {
          res.status(200).send({ msg: 'buka buka is awake.' });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });

    this.router.post('/sleep', auth, (_, res) => {
      BukaBukaService.stop()
        .then(() => {
          res.status(200).send({ msg: 'buka buka is sleeping.' });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });

    this.router.post('/question', auth, postQuestionValidation, validate, (req: Request, res: Response) => {
      const newQuestion = req.body.question;
      BukaBukaService.setQuestion(newQuestion);
      const question = BukaBukaService.getQuestion();
      if (question === undefined) {
        res.status(500).send({ err: 'buka buka has no questions.' });
        return;
      }
      res.send({ question });
    });

    this.router.post('/happiness', auth, postHappinessValidation, validate, (req: Request, res: Response) => {
      const desiredHappiness = req.body.happiness;
      BukaBukaService.modifyHappiness(desiredHappiness);
      const happiness = BukaBukaService.getHappiness();
      if (desiredHappiness !== happiness) {
        res.status(500).send({ err: 'Failed to change happiness, somehow.' });
        return;
      }
      res.send({ happiness });
    });
  }

  private configurePublicRoutes() {
    this.router.get('/awake', (_, res) => {
      const awake = BukaBukaService.isAwake();
      res.json({ awake });
    });

    this.router.get('/happiness', (_, res) => {
      const happiness = BukaBukaService.getHappiness();
      res.status(200).json({ happiness });
    });

    this.router.get('/answers', (_, res) => {
      const answers = BukaBukaService.getAnswers();
      res.status(200).json({ answers });
    });

    this.router.get('/question', (_, res) => {
      const question = BukaBukaService.getQuestion();
      if (question === undefined) {
        res.status(500).send({ err: 'buka buka has no questions.' });
        return;
      }
      res.send({ question });
    });
  }
}

export default new ApiRouter().router;
