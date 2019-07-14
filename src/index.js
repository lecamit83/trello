const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./configs/db');
const apiRoute = require('./routes/api.route');

const PORT = process.env.PORT || 3000;
const app = express();
// connect database
db.connect();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

// router
app.get('/', function(req, res) {
  res.status(200).send({message : 'This is HomePage'});
});

app.use('/api', apiRoute);

app.use(function(err, req, res, next) {
  res.status(500);
  res.send({message : 'Internal server error', err});
});

app.listen(PORT, function(err) {
  if(err) throw new Error(err);
  console.log(`Server is running on PORT=${PORT}`);
});
