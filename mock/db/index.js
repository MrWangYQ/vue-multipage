// db.js
const task = require('./task');
const gse = require('./gse');
const pass = require('./pass');

module.exports = {
  ...task,
  ...gse,
  ...pass,
};
