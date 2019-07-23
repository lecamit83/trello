const mongoose = require('mongoose');
const { DB_USER, DB_PASS, DB_HOST, DB_HOST_LOCAL, DB_PORT, DB_NAME } = process.env;

function connect() {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}`, {
  useCreateIndex : true,
  useNewUrlParser : true,
  }, function(err) {
    if(err) throw (new Error('Database was error'));
    console.log('Database connected');
  });
};
function localConnect() {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${DB_HOST_LOCAL}:${DB_PORT}/${DB_NAME}`, {
    useCreateIndex : true,
    useNewUrlParser : true,
  }, function (error) {
    if(error) throw (new Error('Database was error'));
    console.log('Database connected');
  });
}
module.exports =  {
  connect,
  localConnect
}

