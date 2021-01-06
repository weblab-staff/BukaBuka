import config from '../../config';
import { emitHappinessLevel, emitAwakeEvent, emitSleepEvent } from '../../socket';
import QuestionService from '../QuestionService';
import runEveryMinute, { stopJobs } from './cron';
import Happiness from './happiness';
import State from '../../models/State';

/**
 * Buka buka loves questions from weblab students. no questions make buka buka sad.
 *
 * The buka buka service is in charge of checking how happy buka buka is during class and
 * finding the questions & answers students are asking.
 */
class BukaBukaService {
  private questions: Array<string> = [];
  private answers: Array<string> = [];
  private happiness: Happiness;
  private questionService: QuestionService;
  private awake = false;

  constructor() {
    this.happiness = new Happiness();
    this.questionService = new QuestionService();
    this.restoreStateIfPreviouslyAwoken();
  }

  /**
   * This method starts the question & answer fetching service.
   * Should only be called when class has started.
   * As a side effect, it will start fetching new questions and answers every minute
   * until `ApiService.stop()` is called.
   */
  start() {
    return State.deleteMany({})
      .then(() => this.findHappinessFromStudents())
      .then(() => this.setupStateRefresh())
      .then(() => {
        const msg = `buka buka has woken up at ${new Date().toTimeString()}`;
        // eslint-disable-next-line no-console
        console.log(`BukaBukaService::wakeUpBukaBuka(): ${msg}`);
        this.awake = true;
        emitAwakeEvent();
      })
      .catch((err) => {
        throw new Error(`BukaBukaService::stop(): Unable to delete state logs: ${err}`);
      });
  }

  isAwake() {
    return this.awake;
  }

  getHappiness() {
    return this.happiness.getHappiness();
  }

  modifyHappiness(desiredHappiness: number) {
    emitHappinessLevel(desiredHappiness);
    this.happiness.forceHappiness(desiredHappiness);
  }

  /**
   * Finds all the questions asked by students in the last
   * 24 hours. This method should only be called when
   * buka buka has awoken.
   */
  getQuestions() {
    if (!this.isAwake) {
      const errMsg = 'BukaBukaService::getQuestions(): buka buka must be awake';
      throw new Error(errMsg);
    }
    return this.questions;
  }

  /**
   * Finds all the answers given by staff in the last
   * 24 hours. This method should only be called when
   * buka buka has awoken.
   */
  getAnswers() {
    return this.answers;
  }

  getAllQuestionsAndAnswers() {
    if (!this.isAwake) {
      const errMsg = 'BukaBukaService::getQuestionsAndAnswers(): buka buka must be awake.';
      throw new Error(errMsg);
    }
    const questionsWithAns: Array<{ question: string; answer: string }> = [];
    this.questions.forEach((question, i) => {
      const answer = this.answers[i] || 'No answer given.';
      questionsWithAns.push({ question, answer });
    });
    return questionsWithAns;
  }

  /**
   * Finds the most recent question. If no question has been asked,
   * it chooses among default phrases.
   */
  getQuestion() {
    if (this.questions.length > 0) {
      return this.questions[0];
    }
    return config.bukabukaThoughts[0];
  }

  setQuestion(question: string) {
    this.questions.unshift(question);
  }

  stop() {
    stopJobs();
    return State.deleteMany({})
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(`BukaBukaService::stop(): buka buka has gone to sleep at ${new Date().toTimeString()}`);
        this.awake = false;
        this.happiness = new Happiness(); // Return to base happiness.
        emitSleepEvent();
      })
      .catch((err) => {
        throw new Error(`BukaBukaService::stop(): Unable to delete state logs: ${err}`);
      });
  }

  private setupStateRefresh() {
    runEveryMinute(() => {
      this.findHappinessFromStudents()
        .then(() => {
          emitHappinessLevel(this.happiness.getHappiness());
        })
        .catch((err) => {
          throw new Error(`BukaBukaService(): Failed to find new happiness: ${err}`);
        });
    });
  }

  private restoreStateIfPreviouslyAwoken() {
    State.findOne({})
      .then((state) => {
        if (state !== undefined && state !== null) {
          this.happiness = new Happiness(state.happiness, state.questionCount);
          return true;
        }
        return false;
      })
      .then((previouslyAwake) => {
        if (previouslyAwake) {
          return this.start();
        }
        return Promise.resolve();
      })
      .catch((err) => {
        throw new Error(`BukaBukaService(): Unable to connect with database service. ${err}`);
      });
  }

  private saveState() {
    return State.findOne({}).then((state) => {
      if (state == null || state == undefined) {
        const baseState = new State({
          questionCount: this.questions.length,
          happiness: this.happiness.getHappiness(),
        });
        return baseState.save();
      } else {
        state.happiness = this.happiness.getHappiness();
        state.questionCount = this.questions.length;
        return state.save();
      }
    });
  }

  private findHappinessFromStudents() {
    return this.getQuestionsAndAnswers()
      .then(({ questions, answers }) => {
        this.questions = questions;
        this.answers = answers;
        return { questions, answers };
      })
      .then(() => this.happiness.calculateHappiness(this.questions.length))
      .then(() => this.saveState());
  }

  private getQuestionsAndAnswers() {
    return this.questionService.getQuestionsAndAnswers();
  }
}

export = new BukaBukaService();
