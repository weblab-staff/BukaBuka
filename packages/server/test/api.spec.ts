// TODO(johancc) - Figure out how to provide types for Response.body
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { expect } from 'chai';
import { agent as request } from 'supertest';
import { createHttpServer } from '../';

const testServer = request(createHttpServer());

describe('Server', () => {
  describe('/api', () => {
    it('is alive', async () => {
      const res = await testServer.get('/api/alive');
      expect(res.status).to.equal(200);
      expect(res.body.alive).to.be.true;
    });

    it('provides happiness', async () => {
      const res = await testServer.get('/api/happiness');
      expect(res.status).to.equal(200);
      expect(res.body.happiness).to.not.be.undefined;
      expect(res.body.happiness).to.be.a('number');
    });

    it('provides question', async () => {
      const res = await testServer.get('/api/question');
      expect(res.status).to.be.equal(200);
      expect(res.body.question).to.be.a('string');
    });

    it('provides answers', async () => {
      const res = await testServer.get('/api/answers');
      expect(res.status).to.be.equal(200);
      expect(res.body.answers).to.be.an('array');
    });

    it('wakes up', async () => {
      const res = await testServer.post('/api/wakeup').send({ pwd: 'codingmonkeys' });
      expect(res.status).to.be.equal(200);
      const awake = await testServer.get('/api/awake');
      expect(awake.status).to.be.equal(200);
      expect(awake.body.awake).to.be.equal(true);
    });

    it('only wakes up for weblab', async () => {
      const res = await testServer.post('/api/wakeup');
      expect(res.status).to.be.equal(403);
    });

    it('changes happiness', async () => {
      const changeHappiness = await testServer.post('/api/happiness').send({ happiness: 1, pwd: 'codingmonkeys' });
      expect(changeHappiness.status).to.be.equal(200);
      const baseHappiness = await testServer.get('/api/happiness');
      expect(baseHappiness.status).to.be.equal(200);
      expect(baseHappiness.body.happiness).to.be.equal(1);
    });

    it('blocks unauthorized happiness', async () => {
      const changeHappiness = await testServer.post('/api/happiness').send({ happiness: 1 });
      expect(changeHappiness.status).to.be.equal(403);
      const baseHappiness = await testServer.get('/api/happiness');
      expect(baseHappiness.status).to.be.equal(200);
      expect(baseHappiness.body.happiness).to.be.a('number');
    });

    it('can change question', async () => {
      const changeQuestion = await testServer
        .post('/api/question')
        .send({ question: 'Am I a code monkey?', pwd: 'codingmonkeys' });
      expect(changeQuestion.status).to.be.equal(200);
      const getQuestion = await testServer.get('/api/question');
      expect(getQuestion.status).to.be.equal(200);
      expect(getQuestion.body.question).to.be.equal('Am I a code monkey?');
    });

    it('blocks unauthorized question', async () => {
      const changeQuestion = await testServer.post('/api/question').send({ question: 'Am I a code monkey?' });
      expect(changeQuestion.status).to.be.equal(403);
    });

    it('does not sleep without password', async () => {
      const req = await testServer.post('/api/sleep');
      expect(req.status).to.be.equal(403);
    });

    it('goes to sleep', async () => {
      const req = await testServer.post('/api/sleep').send({ pwd: 'codingmonkey' });
      expect(req.status).to.be.equal(403);
    });
  });
});
