const mongoose = require('mongoose');
const { DB_USER, DB_PASS, DB_HOST } = process.env;
function connect() {
  mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}`, {
  useCreateIndex : true,
  useNewUrlParser : true,
  }, function(err) {
    if(err) return next(new Error('Database was error'));
    console.log('Database connected');
  });
};
module.exports =  {
  connect,
}

