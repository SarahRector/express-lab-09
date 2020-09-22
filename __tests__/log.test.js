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
        // eslint-disable-next-line no-unused-vars
        logs.forEach(log => {
          expect(res.body).toEqual(expect.arrayContaining(logs));
        });
      });
  });

  it('updates a log by id via PUT', async() => {
    const log = await Log.insert({
      recipeId: 123,
      dateOfEvent: 'March 8th',
      notes: 'sub-par',
      rating: 2
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: 888,
        dateOfEvent: 'September 8th',
        notes: 'exquisite',
        rating: 10
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: 888,
          dateOfEvent: 'September 8th',
          notes: 'exquisite',
          rating: 10
        });
      });
  });

  it('finds a log by id via GET', async() => {
    const log = await Log.insert({
      recipeId: 123,
      dateOfEvent: 'March 8th',
      notes: 'sub-par',
      rating: 2
    });

    const response = await request(app)
      .get(`/api/v1/logs/${log.id}`);

    expect(response.body).toEqual(log);
  });

  it('deletes a log via DELETE', async() => {
    const log = await Log.insert({
      recipeId: 123,
      dateOfEvent: 'March 8th',
      notes: 'sub-par',
      rating: 2
    });

    const response = await request(app)
      .delete(`/api/v1/logs/${log.id}`);

    expect(response.body).toEqual(log);
  });
});
