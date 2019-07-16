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
  }],
  lists : [{ list : {type : Schema.Types.ObjectId, ref : 'List'}}],
}, {
  timestamps : true,
});

boardSchema.methods.toJSON = function () {
  const board = this;
  let obj = board.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
