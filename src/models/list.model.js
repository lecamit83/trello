const Board = require('../models/board.model');
const Card = require('../models/card.model');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listSchema = new Schema({
  title : {
    type: String,
  },
  cards : [{card : {type : Schema.Types.ObjectId, ref :  'Card'}}],
  from : { type : Schema.Types.ObjectId, ref : 'Board' },
}, {
  timestamps : true,
});


listSchema.methods.toJSON = function() {
  const list = this;
  let obj = list.toObject();
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;
  return obj;
}

const List = mongoose.model('List', listSchema);
module.exports = List;
