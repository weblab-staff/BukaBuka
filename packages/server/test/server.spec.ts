import { expect } from "chai";
import {agent as request } from 'supertest';
import { createHttpServer } from '@bukabuka/server';

const testServer = request(createHttpServer());

describe("Server", () => {
  describe("/", () => {
    it('should load', async () => {
      const res = await testServer.get('/server');
      expect(res.status).to.equal(200);
    })
  })
  describe("/server", () => {
    it("should load", async () => {
      const res = await testServer.get('/server');
      expect(res.status).to.equal(200);
    })
  })
})
