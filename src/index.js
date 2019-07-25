const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
require('dotenv').config();

const db = require('./configs/db');
const apiRoute = require('./routes/api.route');

const PORT = process.env.PORT || 3000;
const app = express();
// connect database
db.localConnect();
// middleware
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

// router
app.get('/', function(req, res) {
  res.status(200).send({url : 'http://localhost:5050/uploads/1563856223746-heo.jpeg'});
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api', apiRoute);

app.use(function(err, req, res, next) {
  res.status(500).send({message : 'Internal server error', err});
});

app.listen(PORT, function(err) {
  if(err) throw new Error(err);
  console.log(`Server is running on PORT=${PORT}`);
});
module.exports = app;
