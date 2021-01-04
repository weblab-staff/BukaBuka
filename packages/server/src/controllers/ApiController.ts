/* eslint-disable no-console */
import type { docs_v1 } from 'googleapis';
import google from '../google';
import config from '../config';
import { emitHappinessLevel } from '../socket';
import runEveryMinute, { stopJobs } from './cron'
import Happiness  from './happiness';
import State from '../models/State';

const GOOGLE_DOC_MIMETYPE = 'application/vnd.google-apps.document';
const START_TOKEN: string = config.startToken;

class ApiController {
  private questions: Array<string> = [];
  private answers: Array<string> = [];
  private happiness: Happiness;

  constructor() {
    this.happiness = new Happiness();

    State.findOne({}).then((state) => {
      if (state !== undefined && state !== null) {
        this.happiness = new Happiness(state.happiness, state.questionCount);
        return true;
      }
      return false;
    }).then((previouslyAwake) => {
      if (previouslyAwake) {
        return this.wakeUpBukaBuka();
      }
      return Promise.resolve();
    }).catch((err) => {
     console.log(`ApiController(): Unable to find state logs: ${err}`);
    });
  }

  wakeUpBukaBuka(): Promise<void> {
   
    return State.deleteMany({})
    .then(() => this.setupDataRefresh())
    .then(() => {
      console.log("ApiController(): buka buka has awakened.");
    });
  }

  getHappiness(): number {
    return this.happiness.getHappiness();
  }

  modifyHappiness(desiredHappiness: number): void  {
    this.happiness.forceHappiness(desiredHappiness);
  }

  getQuestions() {
    return this.questions;
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

  getAnswers() {
    return this.answers;
  }

  alive(): Promise<boolean> {
    const docs = google.docs({ version: 'v1' });
    return docs.documents
      .get({
        // This ID is provided by Google, ideally it should not change.
        documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
      })
      .then(() => true)
      .catch(() => false);
  }

  stop(): Promise<void> {
    stopJobs();
    this.happiness = new Happiness(); // Return to base happiness.
    return State.deleteMany({}).then(() => {
      console.log("ApiController(): Successfully cleared state logs.")
    });
  }

  private setupDataRefresh() {
    runEveryMinute(() => {
      this.findHappinessFromStudents().then(() => {
        emitHappinessLevel(this.happiness.getHappiness())
      }).catch((err) => {
        console.log(`ApiController(): Failed to find new happiness: ${err}`)
      });
    });
  }
  
  private findHappinessFromStudents() {
    console.log("Finding happiness...");
    return this.loadData()
      .then(() => 
        this.happiness.calculateHappiness(this.questions.length))
      .then(() => {
        return State.findOne({}).then((state) => {
          if (state == null || state == undefined) {
            const baseState = new State(
              {
                questionCount: this.questions.length, 
                happiness: this.happiness.getHappiness()
              });
            return baseState.save()
          } else {
            state.happiness = this.happiness.getHappiness();
            state.questionCount = this.questions.length;
            return state.save();
          }
        })
      })
  }

  private loadData() {
    // We reload all the data every minute.
    this.questions = [];
    this.answers = [];
    return this.getLatestDoc()
      .then((docId) => this.getDocument(docId))
      .then((doc) => this.parseDocument(doc))
      .then(() => this.validateParsing())
      .catch((err) => {
        console.log(`ApiController(): Unable to parse google doc: ${err}`);
      });
  }

  private getLatestDoc(): Promise<string> {
    return google
      .drive({ version: 'v2' })
      .files.list(
        { spaces: 'drive', orderBy: 'createdDate', q: `mimeType='${GOOGLE_DOC_MIMETYPE}'`, maxResults: 1 })
      .then((resp) => resp.data.items)
      .then((files) => {
        if (files === undefined || files === null || files.length === 0) {
          throw new Error('ApiController(): buka buka could not find any files.');
        }
        const doc = files[0];
        return doc?.id;
      })
      .then((id) => {
        if (id === undefined || id === null) throw new Error('ApiController(): buka buka is confused');
        return id;
      });
  }

  private getDocument(documentId: string) {
    return google
      .docs({ version: 'v1' })
      .documents.get({ documentId })
      .then((resp) => resp.data);
  }

  private parseDocument(document: docs_v1.Schema$Document) {
    // Parsing works by alternating between two states:
    // true -> parsing question
    // false -> parsing answer
    // We use START_TOKEN to know when the questions start.
    let startParsing = false;
    let state = false;
    document.body?.content?.map((element) => {
      element.paragraph?.elements?.map((p) => {
        const rawText = p.textRun?.content?.toString();
        if (rawText === undefined) return;
        const text = rawText.trim();
        if (text === '') return;
        if (text === START_TOKEN) {
          startParsing = true;
          return; // We don't want to parse the START_TOKEN.
        }
        if (!startParsing) {
          return;
        }
        state = this.parseText(text, this.isQuestion(p), state);
      });
    });
  }

  private isQuestion(element: docs_v1.Schema$ParagraphElement): boolean {
    // We assume questions questions are bolded.
    const isBold = element.textRun?.textStyle?.bold;
    return isBold !== undefined && isBold !== null && isBold;
  }

  private parseText(text: string, isQuestion: boolean, isParsingQuestion: boolean) {
    let newState = isParsingQuestion;
    if (isQuestion && isParsingQuestion) {
      this.questions[-1] += ` ${text}`;
    } else if (isQuestion) {
      this.questions.push(text);
      newState = true;
    } else if (!isQuestion && isParsingQuestion) {
      newState = false;
      this.answers.push(text);
    } else {
      this.answers[-1] += ` ${text}`;
    }
    return newState;
  }

  private validateParsing() {
    if (this.questions.length < this.answers.length) {
      throw new Error('ApiController(): Somehow, buka buka has more answers than questions.');
    }
  }
}

export = new ApiController();
