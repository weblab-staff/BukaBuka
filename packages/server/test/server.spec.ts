// TODO(johancc) - Figure out how to provide types for Response.body
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { expect } from 'chai';
import { agent as request } from 'supertest';
import { createHttpServer } from '../';

const testServer = request(createHttpServer());

describe('Server', () => {
  describe('/heartbeat', () => {
    it('should be alive', async () => {
      const res = await testServer.get('/heartbeat');
      expect(res.status).to.equal(200);
    });
  });
});
