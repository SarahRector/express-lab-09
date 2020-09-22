const { Router } = require('express');
const Log = require('../models/log');

// eslint-disable-next-line new-cap
module.exports = Router()
  .post('/', (req, res, next) => {
    Log
      .insert(req.body)
      .then(log => res.send(log))
      .catch(next);
  })
  
  .get('/', (req, res, next) => {
    Log
      .find()
      .then(logs => res.send(logs))
      .catch(next);
  });
