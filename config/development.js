"use strict"
module.exports = {
  env: 'development',
  db: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`,
  port: process.env.PORT || 4000,
};
