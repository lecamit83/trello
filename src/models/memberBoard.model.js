const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberBoardSchema = new Schema({
  userId : {
    type: Schema.Types.ObjectId,
    ref : 'User'
  },
  boardId : {
    type: Schema.Types.ObjectId,
    ref : 'Board'
  }
}, {
  timestamps : true,
});

const MemberBoard = mongoose.model('MemberBoard', memberBoardSchema);
module.exports = MemberBoard;
