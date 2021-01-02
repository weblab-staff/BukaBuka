/* eslint-disable no-console */
import type { docs_v1 } from 'googleapis';
import google from '../google';
import config from '../config';
const GOOGLE_DOC_MIMETYPE = 'application/vnd.google-apps.document';
const START_TOKEN: string = config.startToken;

class ApiController {
  private questions: Array<string> = [];
  private answers: Array<string> = [];

  constructor() {
    // Temp values while we resolve the api.
    this.loadData();
  }

  private loadData() {
    this.getLatestDoc()
      .then((docId) => this.getDocument(docId))
      .then((doc) => this.parseDocument(doc))
      .then(() => this.validateParsing())
      .then(() => {
        this.questions.map((q, i) => {
          console.log(q);
          console.log(this.answers[i]);
        })
      })
      .catch((err) => {
        console.log(`ApiController(): Unable to parse google doc: ${err}`);
      });
  }

  private getLatestDoc(): Promise<string> {
    return google
      .drive({ version: 'v2' })
      .files.list({ spaces: 'drive', orderBy: 'createdDate', q: `mimeType='${GOOGLE_DOC_MIMETYPE}'`, maxResults: 1 })
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

  getHappiness(): number {
    return 1;
  }

  modifyHappiness() {
    throw new Error('ApiController(): not implemented');
  }

  getQuestions() {
    return this.questions;
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
}

export = new ApiController();
