const mongoose = require('mongoose');
const { DB_USER, DB_PASS, DB_HOST, DB_HOST_LOCAL, DB_PORT, DB_NAME } = process.env;

function connect() {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}`, {
    useCreateIndex : true,
    useNewUrlParser : true,
    }, function(err ) {
      if(err) throw (new Error('Database was error'));
      console.log('Database connected');
    });
};

var createTextIndex = function(db) {
  // Get the boards collection
  var collection = db.collection('boards');
  // Create the index
  collection.createIndex(
    { "$**" : "text" }, function(err, result) {
    console.log(result);
  });
};

function localConnect() {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${DB_HOST_LOCAL}:${DB_PORT}/${DB_NAME}`, {
    useCreateIndex : true,
    useNewUrlParser : true,
  }, function (error, db) {  
    if(error) throw (new Error('Database was error'));
    console.log('Database connected');
    //createTextIndex(db);
  });
}
module.exports =  {
  connect,
  localConnect
}

