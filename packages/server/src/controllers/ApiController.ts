import google from '../google';

class ApiController {

  getHappiness(): number {
    return 1;
  }

  modifyHappiness() {
    throw new Error('not implemented');
  }

  getQuestion(): void {
    throw new Error('not implemented');
  }

  alive(): Promise<boolean> {
    const docs = google.docs({version: 'v1'});
    return docs.documents.get({
      documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
    }).then(() => true)
      .catch(() => false);
  }

}

export = new ApiController();
