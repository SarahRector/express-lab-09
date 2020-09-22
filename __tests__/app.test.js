const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: {
          flour: {
            amount: '1',
            measurement: 'cup'
          },
          sugar: {
            amount: '4',
            measurement: 'tablespoons'
          },
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: {
            flour: {
              amount: '1',
              measurement: 'cup'
            },
            sugar: {
              amount: '4',
              measurement: 'tablespoons'
            },
          }
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        // eslint-disable-next-line no-unused-vars
        recipes.forEach(recipe => {
          expect(res.body).toEqual(expect.arrayContaining(recipes));
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: {
        flour: {
          amount: '1',
          measurement: 'cup'
        },
        sugar: {
          amount: '4',
          measurement: 'tablespoons'
        },
      }
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: {
          flour: {
            amount: '1',
            measurement: 'cup'
          },
          sugar: {
            amount: '4',
            measurement: 'tablespoons'
          },
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: {
            flour: {
              amount: '1',
              measurement: 'cup'
            },
            sugar: {
              amount: '4',
              measurement: 'tablespoons'
            },
          }
        });
      });
  });

  it('finds a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: {
        flour: {
          amount: '1',
          measurement: 'cup'
        },
        sugar: {
          amount: '4',
          measurement: 'tablespoons'
        },
      }
    });

    const response = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);

    expect(response.body).toEqual(recipe);
  });

  it('deletes a recipe', async() => {
    const recipe = await Recipe.insert({
      name: 'excellent cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: {
        flour: {
          amount: '1',
          measurement: 'cup'
        },
        sugar: {
          amount: '4',
          measurement: 'tablespoons'
        },
      }
    });

    const response = await request (app)
      .delete(`/api/v1/recipes/${recipe.id}`);

    expect(response.body).toEqual(recipe);
  });
});
