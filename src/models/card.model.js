const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cardSchema = new Schema({
  title : {
    type : String,
    required : true,
  },
  members : [{
    userId : {
      type : Schema.Types.ObjectId,
      ref : 'User'
    }
  }],
  dueDate : {
    type : Date,
  },
  description : {
    type : String,
  },
  tasks : [],
  comments : [],
  fromList : {
    type : Schema.Types.ObjectId,
    ref : 'List'
  }
});

cardSchema.methods.toJSON = function () {
  let card = this;
  let obj = card.toObject();

  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  
  return obj;
}

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
