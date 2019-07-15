const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  title : {
    type: String,
  },
  members : [{
    userId : {
      type : Schema.Types.ObjectId,
      ref : 'User'
    },
    isAdmin : {
      type : Boolean,
      default : false
    }
  }]
}, {
  timestamps : true,
});

boardSchema.methods.toJSON = function () {
  const board = this;
  let obj = board.toObject();
  //delete obj.members;
  delete obj.__v;
  return obj;
}

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
