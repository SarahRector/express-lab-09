const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a log via POST', async() => {
    const response = await request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: 123,
        dateOfEvent: 'March 8th',
        notes: 'sub-par',
        rating: 2
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      recipeId: expect.any(Number),
      dateOfEvent: 'March 8th',
      notes: 'sub-par',
      rating: 2
    });
  });

  it('gets all logs via GET', async() => {
    const logs = await Promise.all([
      { recipeId: 123, dateOfEvent: 'March 8th', notes: 'sub-par', rating: 2 },
      { recipeId: 456, dateOfEvent: 'March 9th', notes: 'meh', rating: 3 },
      { recipeId: 789, dateOfEvent: 'March 10th', notes: 'i guess i would eat it again', rating: 3 },
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toEqual(expect.arrayContaining(logs));
        });
      });
  });
});
