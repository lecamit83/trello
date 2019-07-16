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
  dueTime : {
    date : {
      type : String,
    },
    time : {
      time : String,
    }
  },
  description : {
    type : String,
  },
  tasks : [{
    title : {
      type : String,
    }, 
    isCompleted : {
      type : Boolean,
      default : false,
    }
  }],
  comments : [],
  from : { type : Schema.Types.ObjectId, ref : 'List' },
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
