import type { docs_v1 } from 'googleapis';
import google from './google';
import config from '../../config';

export default class QuestionService {
  private googleDocsApi = google.docs({ version: 'v1' });
  private googleDriveApi = google.drive({ version: 'v2' });
  private maxNumOfDocuments = 2;
  /**
   * Finds the questions asked by students today across all question documents used
   * within the last 24 hours.
   */
  getQuestionsAndAnswers(): Promise<{ questions: Array<string>; answers: Array<string> }> {
    return this.getQuestionsAndAnswersFromToday();
  }

  private getQuestionsAndAnswersFromToday(): Promise<{ questions: Array<string>; answers: Array<string> }> {
    return this.getDocsIdsFromGoogleDrive()
      .then((ids) => {
        return Promise.all(ids.map((id) => this.getDocument(id)));
      })
      .then((docs) => {
        const allQuestions: Array<string> = [];
        const allAnswers: Array<string> = [];
        docs.forEach((doc) => {
          const { questions, answers } = this.getQuestionsAndAnswersFromDoc(doc);
          allQuestions.push(...questions);
          allAnswers.push(...answers);
        });
        return { questions: allQuestions, answers: allAnswers };
      });
  }

  private getDocsIdsFromGoogleDrive() {
    const query = this.buildGoogleDriveQuery();
    return this.googleDriveApi.files
      .list({ spaces: 'drive', q: query, orderBy: 'modifiedDate desc', maxResults: this.maxNumOfDocuments })
      .then((resp) => resp.data.items)
      .then((files) => {
        if (files === undefined || files === null || files.length === 0) {
          throw new Error('ApiController(): buka buka could not find any files.');
        }
        const docIdsMaybeNull = files.filter((file) => file !== null && file !== undefined).map((file) => file?.id);
        return docIdsMaybeNull;
      })
      .then((docIdsMaybeNull) => {
        // Not using .filter() because the type of the elements after filter is still
        // { string | undefined | null }.
        const ids: string[] = [];
        docIdsMaybeNull.forEach((id) => {
          if (id !== undefined && id !== null) {
            ids.push(id);
          }
        });
        return ids;
      });
  }

  private buildGoogleDriveQuery(): string {
    const GOOGLE_DOC_MIMETYPE = 'application/vnd.google-apps.document';
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const isoStringUpToSeconds = yesterday.toISOString();
    // Query language found here: https://developers.google.com/drive/api/v2/search-files
    const fileQuery = `modifiedDate > '${isoStringUpToSeconds}' and mimeType contains '${GOOGLE_DOC_MIMETYPE}'`;
    return fileQuery;
  }

  private getDocument(documentId: string) {
    return this.googleDocsApi.documents.get({ documentId }).then((resp) => resp.data);
  }

  private getQuestionsAndAnswersFromDoc(doc: docs_v1.Schema$Document) {
    // Parsing works by alternating between three states:
    // Not parsing, parsing question, parsing answer.

    // We use START_TOKEN to know when the questions start.
    const START_TOKEN = config.startToken;
    let startParsing = false;
    let isParsingQuestion = false;
    const questions: Array<string> = [];
    const answers: Array<string> = [];
    const paragraphElements = this.getParagraphElements(doc);
    paragraphElements.forEach((element) => {
      const rawText = element.textRun?.content?.toString();
      if (rawText === undefined) {
        return;
      }
      const text = rawText.trim();
      if (text === '') return;
      if (text === START_TOKEN) {
        startParsing = true;
        return; // We don't want to parse the START_TOKEN.
      }
      if (!startParsing) {
        return;
      }

      const isQuestion = this.isQuestion(element);

      if (isQuestion && isParsingQuestion) {
        questions[-1] += ` ${text}`;
      } else if (isQuestion) {
        questions.push(text);
        isParsingQuestion = true;
      } else if (!isQuestion && isParsingQuestion) {
        isParsingQuestion = false;
        answers.push(text);
      } else {
        answers[-1] += ` ${text}`;
      }
    });
    this.validateParsing(questions, answers, doc);
    return { questions, answers };
  }

  private getParagraphElements(doc: docs_v1.Schema$Document): Array<docs_v1.Schema$ParagraphElement> {
    const elements: Array<docs_v1.Schema$ParagraphElement> = [];
    doc.body?.content?.map((element) => {
      element.paragraph?.elements?.map((p) => {
        elements.push(p);
      });
    });
    return elements;
  }

  private isQuestion(element: docs_v1.Schema$ParagraphElement): boolean {
    // We assume questions questions are bolded.
    const isBold = element.textRun?.textStyle?.bold;
    return isBold !== undefined && isBold !== null && isBold;
  }

  private validateParsing(questions: Array<string>, answers: Array<string>, doc: docs_v1.Schema$Document) {
    if (questions.length < answers.length) {
      throw new Error(
        `QuestionService::validateParsing(): Somehow, buka buka has more answers than questions. docId: ${doc.documentId}`
      );
    }
  }
}
