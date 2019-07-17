"use strict"
module.exports = {
  env: 'test',
  db: `mongodb://localhost:27017/trello`,
  port: process.env.PORT || 4000,
};
