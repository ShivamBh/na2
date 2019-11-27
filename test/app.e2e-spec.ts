import * as request from 'supertest';
import { app } from './constants';

describe('should PING root', () => {
  it('gets Root', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect({
        hello: 'test object',
      });
  });
});
