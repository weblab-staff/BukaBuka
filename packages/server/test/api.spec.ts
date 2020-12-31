// TODO(johancc) - Figure out how to provide types for Response.body
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { expect } from 'chai';
import { agent as request } from 'supertest';
import { createHttpServer } from '@bukabuka/server';

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

    it('provides questions', async () => {
      const res = await testServer.get('/api/questions');
      expect(res.status).to.be.equal(200);
      expect(res.body.questions).to.be.an('array');
    });

    it('provides answers', async () => {
      const res = await testServer.get('/api/answers');
      expect(res.status).to.be.equal(200);
      expect(res.body.answers).to.be.an('array');
    });
    
  });
});
