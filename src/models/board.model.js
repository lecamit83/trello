const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  title : {
    type: String,
  }
}, {
  timestamps : true,
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
