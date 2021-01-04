/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from 'express';
import ApiController from '../controllers/ApiController';
import config from '../config';
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

    this.router.get('/awake', (_, res) => {
      const awake = ApiController.isAwake();
      res.json({ awake }).end();
    });

    this.router.get('/happiness', (_, res) => {
      const happiness = ApiController.getHappiness();
      res.status(200).json({ happiness });
    });

    this.router.get('/question', (_, res) => {
      const question = ApiController.getQuestion();
      if (question === undefined) {
        res.status(500).send({ err: 'Unable to find a question' }).end();
        return;
      }
      res.status(200).json({ question });
    });

    this.router.get('/answers', (_, res) => {
      const answers = ApiController.getAnswers();
      res.status(200).json({ answers });
    });

    this.router.post('/wakeup', (req, res) => {
      if (req.body.pwd !== config.password) {
        res
          .status(403)
          .send({ error: "buka buka needs a password to wake up. He doesn't wake up for anything but weblab." })
          .end();
        return;
      }
      ApiController.wakeUpBukaBuka()
        .then(() => {
          res.status(200).send({ msg: 'buka buka is awake.' }).end();
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });

    this.router.post('/sleep', (req, res) => {
      // eslint-disable-next-line no-console
      console.log(req.body.pwd);
      if (req.body.pwd !== config.password) {
        res
          .status(403)
          .send({ error: 'buka buka needs a password to sleep. He only sleeps when weblab is done.' })
          .end();
        return;
      }
      ApiController.stop()
        .then(() => {
          res.status(200).send({ msg: 'buka buka is sleeping.' }).end();
        })
        .catch((err) => {
          res.status(500).send(err).end();
        });
    });

    this.router.get('/question', (_, res) => {
      const question = ApiController.getQuestion();
      if (question === undefined) {
        res.status(500).send({ err: 'buka buka has no questions.' }).end();
        return;
      }
      res.send({ question }).end();
    });

    this.router.post('/question', (req, res) => {
      if (req.body.pwd !== config.password) {
        res.status(403).send({ error: 'only weblab staff can tell buka buka how happy to be' }).end();
        return;
      }
      const newQuestion = req.body.question;
      if (newQuestion === undefined) {
        res.status(400).send({ error: 'No question provided in request body' });
        return;
      }
      ApiController.setQuestion(newQuestion);
      const question = ApiController.getQuestion();
      if (question === undefined) {
        res.status(500).send({ err: 'buka buka has no questions.' }).end();
        return;
      }
      res.send({ question }).end();
    });

    this.router.post('/happiness', (req, res) => {
      if (req.body.pwd !== config.password) {
        res.status(403).send({ error: 'only weblab staff can tell buka buka how happy to be' }).end();
        return;
      }
      if (req.body.happiness === undefined || req.body.happiness > 1 || req.body.happiness < 0) {
        res.status(400).send({ error: 'provide a happiness value between 0 to 1.' }).end();
        return;
      }
      const desiredHappiness = req.body.happiness;
      ApiController.modifyHappiness(desiredHappiness);
      const happiness = ApiController.getHappiness();
      if (desiredHappiness !== happiness) {
        res.status(500).send({ err: 'Failed to change happiness, somehow.' }).end();
        return;
      }
      res.send({ happiness }).end();
    });
  }
}

export default new ApiRouter().router;
