/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Router } from 'express';
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

    this.router.get('/question', (_, res) => {
      const question = ApiController.getQuestion();
      if (question === undefined) {
        res.status(500).send({ err: 'Unable to find a question'});
        return;
      }
      res.status(200).json({ question });
    });

    this.router.get('/answers', (_, res) => {
      const answers = ApiController.getAnswers();
      res.status(200).json({ answers });
    });

    this.router.post('/wakeup', (_, res) => {
      // TODO(johancc) - setup auth.
      ApiController.wakeUpBukaBuka().then(() => {
        res.status(200).end();
      }).catch((err) => {
        res.status(500).send(err);
      });
    });

    this.router.post('/sleep', (_, res) => {
      ApiController.stop().then(() => {
        res.status(200).end();
      }).catch((err) => {
        res.status(500).send(err).end();
      });
    })

    this.router.post('/happiness', (req: Request, res) => {
      const desiredHappiness = req.body.happiness;
      ApiController.modifyHappiness(desiredHappiness);
      const happiness = ApiController.getHappiness();
      if (desiredHappiness !== happiness) {
        res.status(500).send({err: 'Failed to change happiness, somehow.'}).end();
        return;
      }
      res.send({happiness}).end();
    });
  }
}

export default new ApiRouter().router;
