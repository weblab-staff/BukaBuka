// TODO(johancc) - Figure out how to provide types for Response.body
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { expect } from 'chai';
import { agent as request } from 'supertest';
import { createHttpServer } from '@bukabuka/server';

const testServer = request(createHttpServer());

describe('Server', () => {
  describe('/', () => {
    it('should load', async () => {
      const res = await testServer.get('/server');
      expect(res.status).to.equal(200);
    });
  });

  describe('/heartbeat', () => {
    it('should be alive', async () => {
      const res = await testServer.get('/heartbeat');
      expect(res.status).to.equal(200);
    });
  });

  describe('/api', () => {
    it('provides happiness', async () => {
      const res = await testServer.get('/api/happiness');
      expect(res.status).to.equal(200);
      expect(res.body.happiness).to.not.be.undefined;
      expect(res.body.happiness).to.be.a('number');
    });
  });
});
